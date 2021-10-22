import React, { useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import { resetSwap } from 'store/features/swap/swapSlice';
import SwapDialogTitle from '../SwapDialogTitle';
import SwapStopAlert from './SwapStopAlert';
import { useAppDispatch } from '../../../../../store/hooks';
import {
  isSwapStateBtcLockInMempool,
  isSwapStateDownloadingBinary,
  isSwapStateInitiated,
  isSwapStateProcessExited,
  isSwapStateReceivedQuote,
  isSwapStateStarted,
  isSwapStateWaitingForBtcDeposit,
  isSwapStateXmrLockInMempool,
  isSwapStateXmrRedeemInMempool,
  Swap,
  SwapState,
  SwapStateWaitingForBtcDeposit,
} from '../../../../../models/storeModel';
import SwapStateStepper from './SwapStateStepper';
import DownloadingBinaryPage from './pages/happy/DownloadingBinaryPage';
import InitiatedPage from './pages/happy/InitiatedPage';
import WaitingForBitcoinDepositPage from './pages/happy/WaitingForBitcoinDepositPage';
import StartedPage from './pages/happy/StartedPage';
import BitcoinLockTxInMempoolPage from './pages/happy/BitcoinLockTxInMempoolPage';
import XmrLockTxInMempoolPage from './pages/happy/XmrLockInMempoolPage';
import ProcessExitedPage from './pages/happy/ProcessExitedPage';
import XmrRedeemInMempoolPage from './pages/happy/XmrRedeemInMempoolPage';
import ReceivedQuotePage from './pages/happy/ReceivedQuotePage';

const useStyles = makeStyles({
  content: {
    overflow: 'hidden',
    minHeight: '25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

function InnerContent({ state }: { state: SwapState }) {
  if (isSwapStateDownloadingBinary(state)) {
    return <DownloadingBinaryPage state={state} />;
  }
  if (isSwapStateInitiated(state)) {
    return <InitiatedPage />;
  }
  if (isSwapStateReceivedQuote(state)) {
    return <ReceivedQuotePage />;
  }
  if (isSwapStateWaitingForBtcDeposit(state)) {
    return (
      <WaitingForBitcoinDepositPage
        state={state as SwapStateWaitingForBtcDeposit}
      />
    );
  }
  if (isSwapStateWaitingForBtcDeposit(state)) {
    return (
      <WaitingForBitcoinDepositPage
        state={state as SwapStateWaitingForBtcDeposit}
      />
    );
  }
  if (isSwapStateStarted(state)) {
    return <StartedPage />;
  }
  if (isSwapStateBtcLockInMempool(state)) {
    return <BitcoinLockTxInMempoolPage state={state} />;
  }
  if (isSwapStateXmrLockInMempool(state)) {
    return <XmrLockTxInMempoolPage state={state} />;
  }
  if (isSwapStateXmrRedeemInMempool(state)) {
    return <XmrRedeemInMempoolPage state={state} />;
  }
  if (isSwapStateProcessExited(state)) {
    return <ProcessExitedPage state={state} />;
  }
  return <pre>{JSON.stringify(state, null, 4)}</pre>;
}

export default function SwapStatePage({ swap }: { swap: Swap }) {
  const classes = useStyles();
  const [openCancelAlert, setOpenCancelAlert] = useState(false);
  const dispatch = useAppDispatch();

  function onCancel() {
    if (swap.processRunning) {
      setOpenCancelAlert(true);
    } else {
      dispatch(resetSwap());
    }
  }

  return (
    <>
      <SwapDialogTitle title="Swapping BTC for XMR" />

      <DialogContent dividers className={classes.content}>
        <InnerContent state={swap.state as SwapState} />
        <SwapStateStepper state={swap.state as SwapState} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
      </DialogActions>

      <SwapStopAlert
        open={openCancelAlert}
        onClose={() => setOpenCancelAlert(false)}
      />
    </>
  );
}
