import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { UpdateInfo } from 'electron-updater';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { updateShownToUser } from 'store/features/updateSlice';

export default function UpdaterDialog() {
  const dispatch = useAppDispatch();
  const updateNotification: UpdateInfo | null = useAppSelector(
    (state) => state.update.updateNotification,
  );

  if (updateNotification == null) return null;

  function hideNotification() {
    dispatch(updateShownToUser());
  }

  function openDownloadUrl() {
    const downloadUrl = `https://github.com/UnstoppableSwap/unstoppableswap-gui/releases/tag/v${
      updateNotification!.version
    }`;
    window.open(downloadUrl, '_blank');
    hideNotification();
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={Boolean(updateNotification)}
      onClose={() => hideNotification()}
    >
      <DialogTitle>Update Available</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A new version (v{updateNotification.version}) of the software was
          released on{' '}
          {new Date(updateNotification.releaseDate).toLocaleDateString()}.
          Please download and install the update manually to benefit from new
          features and enhancements. Staying updated ensures you have the latest
          improvements and security fixes.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="default"
          onClick={() => hideNotification()}
        >
          Remind me later
        </Button>
        <Button
          endIcon={<SystemUpdateIcon />}
          variant="contained"
          onClick={openDownloadUrl}
          color="primary"
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}
