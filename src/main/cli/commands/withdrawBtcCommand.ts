import { store } from '../../../store/store';
import { spawnSubcommand } from '../cli';
import {
  withdrawAppendStdOut,
  withdrawInitiate,
  withdrawProcessExited,
  withdrawAddLog,
} from '../../../store/features/withdrawSlice';
import { SwapLog } from '../../../models/swapModel';
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

function onSwapLog(log: SwapLog) {
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
      () => {},
      onSwapLog,
      onProcExit,
      onStdOut
    );

    store.dispatch(withdrawInitiate());
  } catch (e) {
    console.error(`Failed to check balance Error: ${e}`);
  }
}
