import {
  SwapLog,
  SwapLogAliceLockedXmr,
  SwapLogBtcTxStatusChanged,
  SwapLogPublishedBtcTx,
  SwapLogReceivedBtc,
  SwapLogReceivedQuote,
  SwapLogReceivedXmrLockTxConfirmation,
  SwapLogRedeemedXmr,
  SwapLogStartedSwap,
  SwapLogWaitingForBtcDeposit,
} from '../../models/swap';
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
import { Provider } from '../../models/store';
import { BinaryDownloadStatus } from '../downloader';
import { spawnSubcommand } from '../cli';

function onSwapLog(log: SwapLog) {
  store.dispatch(addLog(log));

  switch (log.fields.message) {
    case 'Received quote':
      store.dispatch(receivedQuoteLog(log as SwapLogReceivedQuote));
      break;
    case 'Waiting for Bitcoin deposit':
      store.dispatch(
        waitingForBtcDepositLog(log as SwapLogWaitingForBtcDeposit)
      );
      break;
    case 'Received Bitcoin':
      store.dispatch(receivedBtcLog(log as SwapLogReceivedBtc));
      break;
    case 'Starting new swap':
      store.dispatch(startingNewSwapLog(log as SwapLogStartedSwap));
      break;
    case 'Published Bitcoin transaction':
      store.dispatch(publishedBtcTransactionLog(log as SwapLogPublishedBtcTx));
      break;
    case 'Bitcoin transaction status changed':
      store.dispatch(
        btcTransactionStatusChangedLog(log as SwapLogBtcTxStatusChanged)
      );
      break;
    case 'Alice locked Monero':
      store.dispatch(aliceLockedXmrLog(log as SwapLogAliceLockedXmr));
      break;
    case 'Received new confirmation for Monero lock tx':
      store.dispatch(
        xmrLockStatusChangedLog(log as SwapLogReceivedXmrLockTxConfirmation)
      );
      break;
    case 'Successfully transferred XMR to wallet':
      store.dispatch(transferredXmrToWalletLog(log as SwapLogRedeemedXmr));
      break;
    default:
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
