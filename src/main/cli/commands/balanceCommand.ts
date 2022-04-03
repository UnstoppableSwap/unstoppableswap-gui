import { store } from '../../../store/store';
import { spawnSubcommand } from '../cli';
import {
  balanceAddLog,
  balanceAppendStdOut,
  balanceInitiate,
  balanceProcessExited,
} from '../../../store/features/balanceSlice';
import { CliLog } from '../../../models/cliModel';
import logger from '../../../utils/logger';

function onProcExit(code: number | null, signal: NodeJS.Signals | null) {
  store.dispatch(
    balanceProcessExited({
      exitCode: code,
      exitSignal: signal,
    })
  );
}

function onStdOut(data: string) {
  store.dispatch(balanceAppendStdOut(data));
}

function onAddLog(data: CliLog) {
  store.dispatch(balanceAddLog(data));
}

export default async function spawnBalanceCheck() {
  try {
    store.dispatch(balanceInitiate());

    await spawnSubcommand(
      'balance',
      {},
      (logs) => logs.forEach(onAddLog),
      onProcExit,
      onStdOut
    );
  } catch (e) {
    logger.error(
      { error: (e as Error).toString() },
      `Failed to spawn balance check`
    );
    onProcExit(null, null);
  }
}
