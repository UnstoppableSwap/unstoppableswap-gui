import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from '@material-ui/core';
import { UpdateFileInfo, UpdateInfo } from 'electron-updater';
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

  const releasePageUrl = `https://github.com/UnstoppableSwap/unstoppableswap-gui/releases/tag/v${
    updateNotification!.version
  }/`;

  function openDownloadUrl() {
    window.open(releasePageUrl, '_blank');
    hideNotification();
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={Boolean(updateNotification)}
      onClose={() => hideNotification()}
    >
      <DialogTitle>Update Available</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A new version (v{updateNotification.version}) of the software was
          released on{' '}
          {new Date(updateNotification.releaseDate).toLocaleDateString()}.
          <br />
          Updating ensures you have the latest improvements and security fixes. Please visit the release page, download one of the files listed below, and install it manually.
          <Typography variant="caption">
            <ul style={{ padding: '0', paddingLeft: '1rem' }}>
              {updateNotification.files.map((file) => (
                <li key={file.url}>
                  {file.url}
                </li>
              ))}
            </ul>
          </Typography>
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
          OPEN DOWNLOAD PAGE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
