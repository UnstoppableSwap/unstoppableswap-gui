import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
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
      <DialogTitle>Force stop running operation?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to force stop the running operation? This might
          have unintended consequences.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button onClick={handleSwapCancel} color="primary">
          Force stop
        </Button>
      </DialogActions>
    </Dialog>
  );
}
