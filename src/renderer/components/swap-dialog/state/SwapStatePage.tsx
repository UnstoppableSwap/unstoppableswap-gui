import React, { useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import SwapDialogTitle from '../SwapDialogTitle';
import SwapStopAlert from './SwapStopAlert';
import {
  SwapState,
  SwapStateBtcLockInMempool,
  SwapStateInitiated,
  SwapStatePreparingBinary,
  SwapStateProcessExited,
  SwapStateWaitingForBtcDeposit,
  SwapStateXmrLockInMempool,
  SwapStateXmrRedeemInMempool,
} from '../../../../swap/swap-state-machine';
import SwapStateStepper from './SwapStateStepper';
import PreparingBinaryPage from './pages/PreparingBinaryPage';
import useStore from '../../../store';
import WaitingForBitcoinDepositPage from './pages/WaitingForBitcoinDepositPage';
import BitcoinLockTxInMempoolPage from './pages/BitcoinLockTxInMempoolPage';
import InitiatedPage from './pages/InitiatedPage';
import StartedPage from './pages/StartedPage';
import XmrLockTxInMempoolPage from './pages/XmrLockInMempoolPage';
import XmrRedeemInMempoolPage from './pages/XmrRedeemInMempoolPage';
import ProcessExitedPage from './pages/ProcessExitedPage';

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
  switch (state.state) {
    case 'preparing binary':
      return <PreparingBinaryPage state={state as SwapStatePreparingBinary} />;
    case 'initiated':
      return <InitiatedPage state={state as SwapStateInitiated} />;
    case 'waiting for btc deposit':
      return (
        <WaitingForBitcoinDepositPage
          state={state as SwapStateWaitingForBtcDeposit}
        />
      );
    case 'started':
      return <StartedPage />;
    case 'btc lock tx is in mempool':
      return (
        <BitcoinLockTxInMempoolPage
          state={state as SwapStateBtcLockInMempool}
        />
      );
    case 'xmr lock tx is in mempool':
      return (
        <XmrLockTxInMempoolPage state={state as SwapStateXmrLockInMempool} />
      );
    case 'xmr redeem tx is in mempool':
      return (
        <XmrRedeemInMempoolPage state={state as SwapStateXmrRedeemInMempool} />
      );
    case 'process excited':
      return <ProcessExitedPage state={state as SwapStateProcessExited} />;
    default:
      return <pre>{JSON.stringify(state, null, '\t')}</pre>;
  }
}

export default function SwapStatePage({ state }: { state: SwapState }) {
  const classes = useStyles();
  const [openCancelAlert, setOpenCancelAlert] = useState(false);
  const setSwapState = useStore((s) => s.setSwapState);

  function onCancel() {
    if (state.running) {
      setOpenCancelAlert(true);
    } else {
      setSwapState(null);
    }
  }

  return (
    <>
      <SwapDialogTitle title="Swapping BTC for XMR" />

      <DialogContent dividers className={classes.content}>
        <InnerContent state={state} />
        <SwapStateStepper state={state} />
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
