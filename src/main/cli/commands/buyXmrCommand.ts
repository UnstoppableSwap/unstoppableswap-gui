import { SwapLog } from '../../../models/swapModel';
import { store } from '../../../store/store';
import {
  swapAddLog,
  swapAppendStdOut,
  swapDownloadProgressUpdate,
  swapInitiate,
  swapProcessExited,
} from '../../../store/features/swapSlice';
import { Provider } from '../../../models/storeModel';
import { BinaryDownloadStatus } from '../downloader';
import { spawnSubcommand } from '../cli';
import spawnBalanceCheck from './balanceCommand';

function onSwapLog(log: SwapLog) {
  store.dispatch(swapAddLog(log));
}

function onDownloadProgress(status: BinaryDownloadStatus) {
  store.dispatch(swapDownloadProgressUpdate(status));
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

function onStdOut(data: string) {
  store.dispatch(swapAppendStdOut(data));
}

export async function spawnBuyXmr(
  provider: Provider,
  redeemAddress: string,
  refundAddress: string
) {
  const sellerIdentifier = `${provider.multiAddr}/p2p/${provider.peerId}`;

  store.dispatch(
    swapInitiate({
      provider,
      resume: false,
    })
  );

  await spawnSubcommand(
    'buy-xmr',
    {
      'change-address': refundAddress,
      'receive-address': redeemAddress,
      seller: sellerIdentifier,
    },
    onDownloadProgress,
    onSwapLog,
    onProcExit,
    onStdOut
  );

  store.dispatch(
    swapInitiate({
      provider,
      resume: false,
    })
  );
}

export async function resumeBuyXmr(swapId: string) {
  store.dispatch(
    swapInitiate({
      provider: null,
      resume: true,
    })
  );

  await spawnSubcommand(
    'resume',
    {
      'swap-id': swapId,
    },
    onDownloadProgress,
    onSwapLog,
    onProcExit,
    onStdOut
  );

  store.dispatch(
    swapInitiate({
      provider: null,
      resume: true,
    })
  );
}
