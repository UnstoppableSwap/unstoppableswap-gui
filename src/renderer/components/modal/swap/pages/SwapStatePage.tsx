import { Box } from '@material-ui/core';
import {
  isSwapStateBtcCancelled,
  isSwapStateBtcLockInMempool,
  isSwapStateBtcRedemeed,
  isSwapStateBtcRefunded,
  isSwapStateInitiated,
  isSwapStateProcessExited,
  isSwapStateReceivedQuote,
  isSwapStateStarted,
  isSwapStateWaitingForBtcDeposit,
  isSwapStateXmrLocked,
  isSwapStateXmrLockInMempool,
  isSwapStateXmrRedeemInMempool,
  SwapState,
} from '../../../../../models/storeModel';
import InitiatedPage from './init/InitiatedPage';
import WaitingForBitcoinDepositPage from './init/WaitingForBitcoinDepositPage';
import StartedPage from './in_progress/StartedPage';
import BitcoinLockTxInMempoolPage from './in_progress/BitcoinLockTxInMempoolPage';
import XmrLockTxInMempoolPage from './in_progress/XmrLockInMempoolPage';
// eslint-disable-next-line import/no-cycle
import ProcessExitedPage from './exited/ProcessExitedPage';
import XmrRedeemInMempoolPage from './done/XmrRedeemInMempoolPage';
import ReceivedQuotePage from './in_progress/ReceivedQuotePage';
import BitcoinRedeemedPage from './in_progress/BitcoinRedeemedPage';
import InitPage from './init/InitPage';
import XmrLockedPage from './in_progress/XmrLockedPage';
import BitcoinCancelledPage from './in_progress/BitcoinCancelledPage';
import BitcoinRefundedPage from './done/BitcoinRefundedPage';

export default function SwapStatePage({
  swapState,
}: {
  swapState: SwapState | null;
}) {
  // TODO: Add punish page here, this is currently handled by the `process exited` page which is not optimal

  if (swapState === null) {
    return <InitPage />;
  }
  if (isSwapStateInitiated(swapState)) {
    return <InitiatedPage />;
  }
  if (isSwapStateReceivedQuote(swapState)) {
    return <ReceivedQuotePage />;
  }
  if (isSwapStateWaitingForBtcDeposit(swapState)) {
    return <WaitingForBitcoinDepositPage state={swapState} />;
  }
  if (isSwapStateStarted(swapState)) {
    return <StartedPage />;
  }
  if (isSwapStateBtcLockInMempool(swapState)) {
    return <BitcoinLockTxInMempoolPage state={swapState} />;
  }
  if (isSwapStateXmrLockInMempool(swapState)) {
    return <XmrLockTxInMempoolPage state={swapState} />;
  }
  if (isSwapStateXmrLocked(swapState)) {
    return <XmrLockedPage />;
  }
  if (isSwapStateBtcRedemeed(swapState)) {
    return <BitcoinRedeemedPage />;
  }
  if (isSwapStateXmrRedeemInMempool(swapState)) {
    return <XmrRedeemInMempoolPage state={swapState} />;
  }
  if (isSwapStateBtcCancelled(swapState)) {
    return <BitcoinCancelledPage />;
  }
  if (isSwapStateBtcRefunded(swapState)) {
    return <BitcoinRefundedPage state={swapState} />;
  }
  if (isSwapStateProcessExited(swapState)) {
    return <ProcessExitedPage state={swapState} />;
  }
  console.error(
    `No swap state page found for swap state State: ${JSON.stringify(
      swapState,
      null,
      4
    )}`
  );
  return (
    <Box>
      No information to display
      <br />
      State: ${JSON.stringify(swapState, null, 4)}
    </Box>
  );
}
