import { dialog } from 'electron';
import { CliLog } from '../../../models/cliModel';
import { store } from '../../../store/store';
import {
  swapAddLog,
  swapAppendStdOut,
  swapInitiate,
  swapProcessExited,
} from '../../../store/features/swapSlice';
import { Provider } from '../../../models/apiModel';
import { spawnSubcommand } from '../cli';
import spawnBalanceCheck from './balanceCommand';
import logger from '../../../utils/logger';
import { providerToConcatenatedMultiAddr } from '../../../utils/multiAddrUtils';
import { getCliLogStdOut } from '../dirs';

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
  const concatenatedMultiAddr = providerToConcatenatedMultiAddr(provider);

  try {
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
        seller: concatenatedMultiAddr,
      },
      onCliLog,
      onProcExit,
      onStdOut
    );
  } catch (err) {
    const error = `Failed to spawn swap Provider: ${concatenatedMultiAddr} RedeemAddress: ${redeemAddress} RefundAddress: ${refundAddress} Error: ${err}`;
    logger.error(
      {
        provider,
        redeemAddress,
        refundAddress,
        err,
      },
      'Failed to spawn swap'
    );

    dialog.showMessageBoxSync({
      title: 'Failed to spawn command',
      message: error,
      type: 'error',
    });
    onProcExit(null, null);
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
  } catch (err) {
    logger.error({ swapId, err }, 'Failed to spawn swap resume');

    const error = `Failed to spawn swap resume SwapID: ${swapId} Error: ${err}`;
    dialog.showMessageBoxSync({
      title: 'Failed to spawn command',
      message: error,
      type: 'error',
    });
    onProcExit(null, null);
  }
}
