import { store } from '../../../store/store';
import { checkBitcoinBalance, spawnSubcommand } from '../cli';
import {
  withdrawAppendStdOut,
  withdrawInitiate,
  withdrawProcessExited,
  withdrawAddLog,
} from '../../../store/features/withdrawSlice';
import { CliLog } from '../../../models/cliModel';
import logger from '../../../utils/logger';

function onProcExit(code: number | null, signal: NodeJS.Signals | null) {
  store.dispatch(
    withdrawProcessExited({
      exitCode: code,
      exitSignal: signal,
    })
  );

  checkBitcoinBalance();
}

function onStdOut(data: string) {
  store.dispatch(withdrawAppendStdOut(data));
}

function onCliLog(log: CliLog) {
  store.dispatch(withdrawAddLog(log));
}

export default async function spawnWithdrawBtc(address: string) {
  try {
    store.dispatch(withdrawInitiate());

    await spawnSubcommand(
      'withdraw-btc',
      {
        address,
      },
      (logs) => logs.forEach(onCliLog),
      onProcExit,
      onStdOut
    );
  } catch (e) {
    logger.error(
      { address, error: (e as Error).toString() },
      `Failed to withdraw funds`
    );
    onProcExit(null, null);
  }
}
