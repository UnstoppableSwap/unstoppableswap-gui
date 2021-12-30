import { store } from '../../../store/store';
import { spawnSubcommand } from '../cli';
import {
  balanceAddLog,
  balanceAppendStdOut,
  balanceInitiate,
  balanceProcessExited,
} from '../../../store/features/balanceSlice';
import { CliLog } from '../../../models/cliModel';

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

    await spawnSubcommand('balance', {}, onAddLog, onProcExit, onStdOut);
  } catch (e) {
    console.error(`Failed to spawn balance check Error: ${e}`);
    onProcExit(null, null);
  }
}
