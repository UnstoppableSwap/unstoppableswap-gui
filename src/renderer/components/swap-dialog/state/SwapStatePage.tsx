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
  SwapStatePreparingBinary,
} from '../../../../swap/swap-state-machine';
import SwapStateStepper from './SwapStateStepper';
import PreparingBinaryPage from './pages/PreparingBinaryPage';
import useStore from '../../../store';

const useStyles = makeStyles({
  content: {
    overflow: 'hidden',
  },
});

function InnerContent({ state }: { state: SwapState }) {
  if (state.state === 'preparing binary') {
    return <PreparingBinaryPage state={state as SwapStatePreparingBinary} />;
  }
  return <pre>{JSON.stringify(state, null, '\t')}</pre>;
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
      <SwapDialogTitle title="Running swap" />

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
