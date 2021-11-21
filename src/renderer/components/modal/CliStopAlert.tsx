import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';
import { ipcRenderer } from 'electron';

type SwapCancelAlertProps = {
  open: boolean;
  onClose: () => void;
};

export default function CliStopAlert({ open, onClose }: SwapCancelAlertProps) {
  async function handleSwapCancel() {
    await ipcRenderer.invoke('stop-cli');
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Stop swap?</DialogTitle>
      <DialogContent>
        <DialogContentText>
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
