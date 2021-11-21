import { store } from '../../../store/store';
import { spawnSubcommand } from '../cli';
import {
  balanceAppendStdOut,
  balanceInitiate,
  balanceProcessExited,
} from '../../../store/features/balanceSlice';

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

export default async function spawnBalanceCheck() {
  try {
    store.dispatch(balanceInitiate());

    await spawnSubcommand(
      'balance',
      {},
      () => {},
      () => {},
      onProcExit,
      onStdOut
    );
  } catch (e) {
    console.error(`Failed to check balance Error: ${e}`);
  }
}
