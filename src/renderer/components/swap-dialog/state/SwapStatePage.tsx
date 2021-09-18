import React, { useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import { reset } from 'store/features/swap/swapSlice';
import SwapDialogTitle from '../SwapDialogTitle';
import SwapStopAlert from './SwapStopAlert';
import { useAppDispatch } from '../../../../store/hooks';
import {
  Swap,
  SwapState,
  SwapStateBtcLockInMempool,
  SwapStateDownloadingBinary,
  SwapStateInitiated,
  SwapStateProcessExited,
  SwapStateType,
  SwapStateWaitingForBtcDeposit,
  SwapStateXmrLockInMempool,
  SwapStateXmrRedeemInMempool,
} from '../../../../models/store';
import SwapStateStepper from './SwapStateStepper';
import DownloadingBinaryPage from './pages/DownloadingBinaryPage';
import InitiatedPage from './pages/InitiatedPage';
import WaitingForBitcoinDepositPage from './pages/WaitingForBitcoinDepositPage';
import StartedPage from './pages/StartedPage';
import BitcoinLockTxInMempoolPage from './pages/BitcoinLockTxInMempoolPage';
import XmrLockTxInMempoolPage from './pages/XmrLockInMempoolPage';
import ProcessExitedPage from './pages/ProcessExitedPage';
import XmrRedeemInMempoolPage from './pages/XmrRedeemInMempoolPage';

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
  switch (state.type) {
    case SwapStateType.DOWNLOADING_BINARY:
      return (
        <DownloadingBinaryPage state={state as SwapStateDownloadingBinary} />
      );
    case SwapStateType.INITIATED:
      return <InitiatedPage state={state as SwapStateInitiated} />;
    case SwapStateType.WAITING_FOR_BTC_DEPOSIT:
      return (
        <WaitingForBitcoinDepositPage
          state={state as SwapStateWaitingForBtcDeposit}
        />
      );
    case SwapStateType.STARTED:
      return <StartedPage />;
    case SwapStateType.BTC_LOCK_TX_IN_MEMPOOL:
      return (
        <BitcoinLockTxInMempoolPage
          state={state as SwapStateBtcLockInMempool}
        />
      );
    case SwapStateType.XMR_LOCK_TX_IN_MEMPOOL:
      return (
        <XmrLockTxInMempoolPage state={state as SwapStateXmrLockInMempool} />
      );
    case SwapStateType.XMR_REDEEM_IN_MEMPOOL:
      return (
        <XmrRedeemInMempoolPage state={state as SwapStateXmrRedeemInMempool} />
      );
    case SwapStateType.PROCESS_EXITED:
      return <ProcessExitedPage state={state as SwapStateProcessExited} />;
    default:
      return <pre>{JSON.stringify(state, null, '\t')}</pre>;
  }
}

export default function SwapStatePage({ swap }: { swap: Swap }) {
  const classes = useStyles();
  const [openCancelAlert, setOpenCancelAlert] = useState(false);
  const dispatch = useAppDispatch();

  function onCancel() {
    if (swap.processRunning) {
      setOpenCancelAlert(true);
    } else {
      dispatch(reset());
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
