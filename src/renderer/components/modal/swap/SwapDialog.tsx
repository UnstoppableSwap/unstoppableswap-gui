import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import SwapStatePage from './pages/SwapStatePage';
import SwapStateStepper from './SwapStateStepper';
import CliStopAlert from '../CliStopAlert';
import { swapReset } from '../../../../store/features/swapSlice';
import SwapDialogTitle from './SwapDialogTitle';
import DebugPage from './pages/DebugPage';

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
  const [debug, setDebug] = useState(false);
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
      <SwapDialogTitle
        debug={debug}
        setDebug={setDebug}
        title="Swap Bitcoin for Monero"
      />

      <DialogContent dividers className={classes.content}>
        {debug ? (
          <DebugPage />
        ) : (
          <>
            <SwapStatePage swapState={swap.state} />
            <SwapStateStepper />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onCancel}
          variant="text"
          disabled={!(swap.processRunning || swap.state === null)}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={onCancel}
          disabled={!(swap.state !== null && !swap.processRunning)}
        >
          Done
        </Button>
      </DialogActions>

      <CliStopAlert
        open={openCancelAlert}
        onClose={() => setOpenCancelAlert(false)}
      />
    </Dialog>
  );
}
