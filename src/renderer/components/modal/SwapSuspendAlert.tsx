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

export default function SwapSuspendAlert({
  open,
  onClose,
}: SwapCancelAlertProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Force stop running operation?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to force stop the running swap?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <IpcInvokeButton
          ipcChannel="suspend-current-swap"
          ipcArgs={[]}
          color="primary"
          onSuccess={onClose}
          requiresRpcDaemon
        >
          Force stop
        </IpcInvokeButton>
      </DialogActions>
    </Dialog>
  );
}
