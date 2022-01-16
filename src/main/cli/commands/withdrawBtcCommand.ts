import { store } from '../../../store/store';
import { spawnSubcommand } from '../cli';
import {
  withdrawAppendStdOut,
  withdrawInitiate,
  withdrawProcessExited,
  withdrawAddLog,
} from '../../../store/features/withdrawSlice';
import { CliLog } from '../../../models/cliModel';
import spawnBalanceCheck from './balanceCommand';

function onProcExit(code: number | null, signal: NodeJS.Signals | null) {
  store.dispatch(
    withdrawProcessExited({
      exitCode: code,
      exitSignal: signal,
    })
  );

  spawnBalanceCheck();
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

    store.dispatch(withdrawInitiate());
  } catch (e) {
    console.error(`Failed to withdraw funds Error: ${e}`);
    onProcExit(null, null);
  }
}
