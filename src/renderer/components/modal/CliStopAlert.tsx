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
          Are you sure you want to force stop the running operation?
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
