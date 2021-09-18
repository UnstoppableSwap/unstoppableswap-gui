import React, { useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import SwapDialogTitle from '../SwapDialogTitle';
import SwapStopAlert from './SwapStopAlert';
import useStore from '../../../store';
import { Swap } from '../../../../store/features/swap/swapSlice';

const useStyles = makeStyles({
  content: {
    overflow: 'hidden',
    minHeight: '25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default function SwapStatePage({ swap }: { swap: Swap }) {
  const classes = useStyles();
  const [openCancelAlert, setOpenCancelAlert] = useState(false);
  const setSwapState = useStore((s) => s.setSwapState);

  function onCancel() {
    if (swap.processRunning) {
      setOpenCancelAlert(true);
    } else {
      setSwapState(null);
    }
  }

  return (
    <>
      <SwapDialogTitle title="Swapping BTC for XMR" />

      <DialogContent dividers className={classes.content}>
        <pre>{JSON.stringify(swap, null, 4)}</pre>
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
