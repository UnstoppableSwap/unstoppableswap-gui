import {
  isSwapLogAliceLockedXmr,
  isSwapLogBtcTxStatusChanged,
  isSwapLogPublishedBtcTx,
  isSwapLogReceivedBtc,
  isSwapLogReceivedQuote,
  isSwapLogReceivedXmrLockTxConfirmation,
  isSwapLogRedeemedXmr,
  isSwapLogStartedSwap,
  isSwapLogWaitingForBtcDeposit,
  SwapLog,
  SwapLogBtcTxStatusChanged,
  SwapLogReceivedXmrLockTxConfirmation,
  SwapLogRedeemedXmr,
} from '../../models/swapModel';
import { store } from '../../store/store';
import {
  addLog,
  aliceLockedXmrLog,
  appendStdOut,
  btcTransactionStatusChangedLog,
  downloadProgressUpdate,
  initiateSwap,
  processExited,
  publishedBtcTransactionLog,
  receivedBtcLog,
  receivedQuoteLog,
  startingNewSwapLog,
  transferredXmrToWalletLog,
  waitingForBtcDepositLog,
  xmrLockStatusChangedLog,
} from '../../store/features/swap/swapSlice';
import { Provider } from '../../models/storeModel';
import { BinaryDownloadStatus } from '../downloader';
import { spawnSubcommand } from '../cli';

function onSwapLog(log: SwapLog) {
  store.dispatch(addLog(log));

  if (isSwapLogReceivedQuote(log)) {
    store.dispatch(receivedQuoteLog(log));
  } else if (isSwapLogWaitingForBtcDeposit(log)) {
    store.dispatch(waitingForBtcDepositLog(log));
  } else if (isSwapLogReceivedBtc(log)) {
    store.dispatch(receivedBtcLog(log));
  } else if (isSwapLogStartedSwap(log)) {
    store.dispatch(startingNewSwapLog(log));
  } else if (isSwapLogPublishedBtcTx(log)) {
    store.dispatch(publishedBtcTransactionLog(log));
  } else if (isSwapLogBtcTxStatusChanged(log)) {
    store.dispatch(
      btcTransactionStatusChangedLog(log as SwapLogBtcTxStatusChanged)
    );
  } else if (isSwapLogAliceLockedXmr(log)) {
    store.dispatch(aliceLockedXmrLog(log));
  } else if (isSwapLogReceivedXmrLockTxConfirmation(log)) {
    store.dispatch(
      xmrLockStatusChangedLog(log as SwapLogReceivedXmrLockTxConfirmation)
    );
  } else if (isSwapLogRedeemedXmr(log)) {
    store.dispatch(transferredXmrToWalletLog(log as SwapLogRedeemedXmr));
  } else {
    console.error(`Swap log was not reduced Log: ${JSON.stringify(log)}`);
  }
}

function onDownloadProgress(status: BinaryDownloadStatus) {
  store.dispatch(downloadProgressUpdate(status));
}

function onProcExit(code: number | null, signal: NodeJS.Signals | null) {
  store.dispatch(
    processExited({
      exitCode: code,
      exitSignal: signal,
    })
  );
}

function onStdOut(data: string) {
  store.dispatch(appendStdOut(data));
}

export default async function startSwap(
  provider: Provider,
  redeemAddress: string,
  refundAddress: string
) {
  const sellerIdentifier = `${provider.multiAddr}/p2p/${provider.peerId}`;

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
    initiateSwap({
      provider,
    })
  );
}
