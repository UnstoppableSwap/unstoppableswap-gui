import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import SwapInitPage from './pages/SwapInitPage';
import { isSwapState } from '../../../../models/storeModel';
import DialogTitle from '../DialogHeader';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import SwapStatePage from './SwapStatePage';
import SwapStateStepper from './SwapStateStepper';
import CliStopAlert from '../CliStopAlert';
import { swapReset } from '../../../../store/features/swapSlice';

const useStyles = makeStyles({
  content: {
    minHeight: '25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default function SwapDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const classes = useStyles();
  const swap = useAppSelector((state) => state.swap);

  const [openCancelAlert, setOpenCancelAlert] = useState(false);
  const dispatch = useAppDispatch();

  function onCancel() {
    if (swap.processRunning) {
      setOpenCancelAlert(true);
    } else {
      onClose();
      setImmediate(() => dispatch(swapReset()));
    }
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle title="Swap Bitcoin for Monero" />

      <DialogContent dividers className={classes.content}>
        {isSwapState(swap.state) ? (
          <SwapStatePage swapState={swap.state} />
        ) : (
          <SwapInitPage />
        )}
        <SwapStateStepper />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
      </DialogActions>

      <CliStopAlert
        open={openCancelAlert}
        onClose={() => setOpenCancelAlert(false)}
      />
    </Dialog>
  );
}
