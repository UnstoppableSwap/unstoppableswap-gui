/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { ElectrumClient } from 'electrum-cash';
import { flatten } from 'lodash';
import { isCliLogPublishedBtcTx } from '../../models/cliModel';
import { isTestnet } from '../../store/config';
import { store } from '../../store/store';
import logger from '../../utils/logger';
import {
  isElectrumTransactionData,
  SwapBlockchainTx,
} from '../../models/electrumModel';
import { isSwapResumable } from '../../models/databaseModel';
import { transactionsStatusChanged } from '../../store/features/electrumSlice';
import { ELECTRUM_PROBE_TRANSACTIONS, ELECTRUM_SERVERS } from './electrumData';

// Verify if the server properly supports https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-transaction-get with verbose=true
async function probeServer(electrum: ElectrumClient, testnet: boolean) {
  try {
    const probeTransaction = testnet
      ? ELECTRUM_PROBE_TRANSACTIONS.testnet
      : ELECTRUM_PROBE_TRANSACTIONS.mainnet;

    const txState = await electrum.request(
      'blockchain.transaction.get',
      probeTransaction.txid,
      true
    );

    if (
      isElectrumTransactionData(txState) &&
      txState.hash === probeTransaction.hash
    ) {
      logger.info(
        { testnet, server: electrum.connection },
        'Connected to and probed Electrum server'
      );
      return true;
    }
    logger.error(
      { testnet, server: electrum.connection },
      'Electrum server did not return probe transaction'
    );
  } catch (err) {
    logger.error(
      { err, testnet, server: electrum.connection },
      'Failed to probe Electrum server'
    );
  }
  return false;
}

async function findAndConnectToElectrumServer(): Promise<ElectrumClient> {
  const servers = ELECTRUM_SERVERS.filter(
    ([testnet]) => testnet === isTestnet()
  );

  for (const [testnet, host, port, transport] of servers) {
    try {
      const electrum = new ElectrumClient(
        'Electrum Client',
        '1.4',
        host,
        port,
        transport
      );
      await electrum.connect();

      const supportsVerboseTransactionResponse = await probeServer(
        electrum,
        testnet
      );

      if (supportsVerboseTransactionResponse) {
        return electrum;
      }

      await electrum.disconnect();
    } catch (err) {
      logger.error(
        { err, host, port, transport },
        `Failed to connect to Electrum Server`
      );
    }
  }
  throw new Error('Failed to connect to any electrum server');
}

function getRelevantSwapBlockchainTransactions(): SwapBlockchainTx[] {
  const state = store.getState();

  return flatten(
    Object.entries(state.log)
      // Only match transactions for swaps that have not yet been completed (and are in database)
      .filter(([swapId]) => {
        const mergedDbState = state.history.find((m) => m.swapId === swapId);
        if (mergedDbState) return isSwapResumable(mergedDbState);
        return false;
      })
      // Find all transactions for that swap
      .map(([swapId, logs]) => {
        return (
          logs
            .filter(isCliLogPublishedBtcTx)
            // Only match lock transactions
            .filter(({ fields: { kind } }) => kind === 'lock')
            .map(({ fields: { txid, kind } }) => ({ swapId, kind, txid }))
        );
      })
  );
}

async function updateTransactions(electrum: ElectrumClient) {
  const transactions = getRelevantSwapBlockchainTransactions();

  logger.debug({ transactions }, 'Retrieving status of transactions');

  const statuses = [];
  for (const transaction of transactions) {
    try {
      // Request the full transaction data for the transaction ID.
      const status = await electrum.request(
        'blockchain.transaction.get',
        transaction.txid,
        true
      );

      if (isElectrumTransactionData(status)) {
        logger.debug({ transaction, status }, 'Received status of transaction');
        statuses.push({ transaction, status });
      } else {
        logger.warn(
          { transaction, status },
          'Electrum server returned incomplete transaction data'
        );
      }
    } catch (e) {
      logger.error({ transaction }, 'Failed to retrieve status of transaction');
    }
  }
  store.dispatch(transactionsStatusChanged(statuses));
}

export default async function watchElectrumTransactions() {
  try {
    const electrum = await findAndConnectToElectrumServer();

    const update = () => updateTransactions(electrum);

    await electrum.subscribe(update, 'blockchain.headers.subscribe');
    await update();
    setInterval(update, 2 * 60 * 1000); // Fetch every 2minutes regardless
  } catch (err) {
    logger.error({ err }, 'Failed to watch blockchain');
  }
}
