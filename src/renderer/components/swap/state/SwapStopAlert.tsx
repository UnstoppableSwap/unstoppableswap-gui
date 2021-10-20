import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';
import { stopProc } from '../../../../swap/cli';

type SwapCancelAlertProps = {
  open: boolean;
  onClose: () => void;
};

export default function SwapStopAlert({ open, onClose }: SwapCancelAlertProps) {
  async function handleSwapCancel() {
    await stopProc();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Stop swap?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          If you have already sent funds, you are at risk of loosing funds if
          you stop the swap and walk away.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSwapCancel} color="primary" autoFocus>
          Stop swap
        </Button>
      </DialogActions>
    </Dialog>
  );
}
