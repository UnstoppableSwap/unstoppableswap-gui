import React from 'react';
import {
  isSwapStateBtcLockInMempool,
  isSwapStateInitiated,
  isSwapStateProcessExited,
  isSwapStateReceivedQuote,
  isSwapStateStarted,
  isSwapStateWaitingForBtcDeposit,
  isSwapStateXmrLockInMempool,
  isSwapStateXmrRedeemInMempool,
  SwapState,
} from '../../../../models/storeModel';
import InitiatedPage from './pages/InitiatedPage';
import WaitingForBitcoinDepositPage from './pages/WaitingForBitcoinDepositPage';
import StartedPage from './pages/StartedPage';
import BitcoinLockTxInMempoolPage from './pages/BitcoinLockTxInMempoolPage';
import XmrLockTxInMempoolPage from './pages/XmrLockInMempoolPage';
import ProcessExitedPage from './pages/ProcessExitedPage';
import XmrRedeemInMempoolPage from './pages/XmrRedeemInMempoolPage';
import ReceivedQuotePage from './pages/ReceivedQuotePage';

export default function SwapStatePage({ swapState }: { swapState: SwapState }) {
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
  if (isSwapStateXmrRedeemInMempool(swapState)) {
    return <XmrRedeemInMempoolPage state={swapState} />;
  }
  if (isSwapStateProcessExited(swapState)) {
    if (swapState.exitCode === 0) {
      if (swapState.prevState) {
        return <SwapStatePage swapState={swapState.prevState} />;
      }
    }
    return <ProcessExitedPage state={swapState} />;
  }
  console.error(
    `No swap state page found for swap state State: ${JSON.stringify(
      swapState,
      null,
      4
    )}`
  );
  return null;
}
