import { dialog } from 'electron';
import { store } from '../../../store/store';
import {
  swapAddLog,
  swapAppendStdOut,
  swapInitiate,
  swapProcessExited,
} from '../../../store/features/swapSlice';
import { getCliLogStdOut } from '../dirs';
import { checkBitcoinBalance, spawnSubcommand } from '../cli';
import logger from '../../../utils/logger';
import { CliLog, SwapSpawnType } from '../../../models/cliModel';

async function onCliLog(logs: CliLog[]) {
  store.dispatch(swapAddLog(logs));
}

async function onStdOut(data: string) {
  store.dispatch(swapAppendStdOut(data));
}

function onProcExit(code: number | null, signal: NodeJS.Signals | null) {
  store.dispatch(
    swapProcessExited({
      exitCode: code,
      exitSignal: signal,
    })
  );

  checkBitcoinBalance();
}

export default async function spawnCancelRefund(swapId: string) {
  function cancel(cb: () => void) {
    return spawnSubcommand(
      'cancel',
      {
        'swap-id': swapId,
      },
      onCliLog,
      cb,
      onStdOut
    );
  }

  function refund() {
    return spawnSubcommand(
      'refund',
      {
        'swap-id': swapId,
      },
      onCliLog,
      onProcExit,
      onStdOut
    );
  }

  try {
    const provider = store
      .getState()
      .history.find((h) => h.swapId === swapId)?.provider;

    if (provider) {
      store.dispatch(
        swapInitiate({
          provider,
          spawnType: SwapSpawnType.CANCEL_REFUND,
          swapId,
        })
      );

      const stdOut = await getCliLogStdOut(swapId);

      let cli = await cancel(async () => {
        cli = await refund();
      });

      cli.stderr.push(stdOut);

      store.dispatch(
        swapInitiate({
          provider,
          spawnType: SwapSpawnType.CANCEL_REFUND,
          swapId,
        })
      );
    } else {
      throw new Error('Could not find swap in database');
    }
  } catch (err) {
    logger.error({ swapId, err }, 'Failed to spawn swap cancel-refund');

    const error = `Failed to spawn swap cancel-refund SwapID: ${swapId} Error: ${err}`;
    dialog.showMessageBoxSync({
      title: 'Failed to cancel-refund command',
      message: error,
      type: 'error',
    });
    onProcExit(null, null);
  }
}
