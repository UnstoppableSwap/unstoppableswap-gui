import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import IpcInvokeButton from '../IpcInvokeButton';

type SwapCancelAlertProps = {
  open: boolean;
  onClose: () => void;
};

export default function CliStopAlert({ open, onClose }: SwapCancelAlertProps) {
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
        <IpcInvokeButton
          ipcChannel="stop-cli"
          ipcArgs={[]}
          color="primary"
          onSuccess={onClose}
        >
          Force stop
        </IpcInvokeButton>
      </DialogActions>
    </Dialog>
  );
}
