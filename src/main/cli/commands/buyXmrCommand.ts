import fs from 'fs/promises';
import { CliLog } from '../../../models/cliModel';
import { store } from '../../../store/store';
import {
  swapAddLog,
  swapAppendStdOut,
  swapInitiate,
  swapProcessExited,
} from '../../../store/features/swapSlice';
import { Provider } from '../../../models/storeModel';
import { spawnSubcommand } from '../cli';
import spawnBalanceCheck from './balanceCommand';
import { getCliLogFile } from '../dirs';

async function onCliLog(logs: CliLog[]) {
  store.dispatch(swapAddLog(logs));
}

function onProcExit(code: number | null, signal: NodeJS.Signals | null) {
  store.dispatch(
    swapProcessExited({
      exitCode: code,
      exitSignal: signal,
    })
  );

  spawnBalanceCheck();
}

async function onStdOut(data: string) {
  store.dispatch(swapAppendStdOut(data));
}

export async function spawnBuyXmr(
  provider: Provider,
  redeemAddress: string,
  refundAddress: string
) {
  try {
    const sellerIdentifier = `${provider.multiAddr}/p2p/${provider.peerId}`;

    store.dispatch(
      swapInitiate({
        provider,
        resume: false,
        swapId: null,
      })
    );

    await spawnSubcommand(
      'buy-xmr',
      {
        'change-address': refundAddress,
        'receive-address': redeemAddress,
        seller: sellerIdentifier,
      },
      onCliLog,
      onProcExit,
      onStdOut
    );
  } catch (e) {
    console.log(
      `Failed to spawn swap Provider: ${provider.peerId} RedeemAddress: ${redeemAddress} RefundAddress: ${refundAddress} Error: ${e}`
    );
    onProcExit(null, null);
  }
}

async function getCliLogStdOut(swapId: string): Promise<string> {
  try {
    const logFile = await getCliLogFile(swapId);
    const prevLogData = await fs.readFile(logFile, {
      encoding: 'utf8',
    });
    return prevLogData;
  } catch (e) {
    throw new Error(
      `Failed to read swap log file! SwapID: ${swapId} Error: ${e}`
    );
  }
}

export async function resumeBuyXmr(swapId: string) {
  try {
    const provider = store
      .getState()
      .history.find((h) => h.swapId === swapId)?.provider;

    if (provider) {
      store.dispatch(
        swapInitiate({
          provider,
          resume: true,
          swapId,
        })
      );

      const stdOut = await getCliLogStdOut(swapId);
      const cli = await spawnSubcommand(
        'resume',
        {
          'swap-id': swapId,
        },
        onCliLog,
        onProcExit,
        onStdOut
      );

      cli.stderr.push(stdOut);
    } else {
      throw new Error('Could not find swap in database');
    }
  } catch (e) {
    console.log(`Failed to spawn swap resume SwapID: ${swapId} Error: ${e}`);
    onProcExit(null, null);
  }
}
