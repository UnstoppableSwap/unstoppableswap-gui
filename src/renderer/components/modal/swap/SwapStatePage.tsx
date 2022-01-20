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
} from '../../../../models/storeModel';
import InitiatedPage from './pages/init/InitiatedPage';
import WaitingForBitcoinDepositPage from './pages/WaitingForBitcoinDepositPage';
import StartedPage from './pages/StartedPage';
import BitcoinLockTxInMempoolPage from './pages/BitcoinLockTxInMempoolPage';
import XmrLockTxInMempoolPage from './pages/XmrLockInMempoolPage';
// eslint-disable-next-line import/no-cycle
import ProcessExitedPage from './pages/ProcessExitedPage';
import XmrRedeemInMempoolPage from './pages/done/XmrRedeemInMempoolPage';
import ReceivedQuotePage from './pages/ReceivedQuotePage';
import BitcoinRedeemedPage from './pages/BitcoinRedeemedPage';
import SwapInitPage from './pages/init/InitPage';
import XmrLockedPage from './pages/XmrLockedPage';
import BitcoinCancelledPage from './pages/BitcoinCancelledPage';
import BitcoinRefundedPage from './pages/done/BitcoinRefundedPage';

export default function SwapStatePage({
  swapState,
}: {
  swapState: SwapState | null;
}) {
  if (swapState === null) {
    return <SwapInitPage />;
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
