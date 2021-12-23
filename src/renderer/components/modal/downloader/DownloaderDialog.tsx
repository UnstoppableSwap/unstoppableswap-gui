import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Typography,
} from '@material-ui/core';
import { useAppSelector } from 'store/hooks';
import { Alert, AlertTitle } from '@material-ui/lab';
import { ipcRenderer } from 'electron';
import DialogTitle from '../DialogHeader';
import LinearProgressWithLabel from '../../progress/LinearProgressWithLabel';
import { isBinaryDownloadStatus } from '../../../../models/downloaderModel';

function ErrorAlert({ error }: { error: string }) {
  async function retry() {
    await ipcRenderer.invoke('initiate-downloader');
  }

  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="large" onClick={retry}>
          RETRY
        </Button>
      }
    >
      <AlertTitle>Update failed</AlertTitle>
      We tried but failed to download the most recent Swap-CLI release from
      Github. Do you have proper internet connectivity?
      <Typography variant="caption">{error}</Typography>
    </Alert>
  );
}

function InnerContent() {
  const progressValue = useAppSelector((s) =>
    isBinaryDownloadStatus(s.downloader.status)
      ? (s.downloader.status.totalDownloadedBytes /
          s.downloader.status.contentLengthBytes) *
        100
      : 0
  );
  const fileSize = useAppSelector(
    (s) => s.downloader.status?.contentLengthBytes
  );
  const error = useAppSelector((s) => s.downloader.error);

  return (
    <>
      {error ? (
        <ErrorAlert error={error} />
      ) : (
        <>
          <DialogContentText>
            Downloading the most recent Swap-CLI release from Github. This might
            take a minute or two depending on your internet speed.
          </DialogContentText>

          <LinearProgressWithLabel value={progressValue} />

          <Typography variant="caption">Size: {fileSize} bytes</Typography>
        </>
      )}
    </>
  );
}

export default function DownloaderDialog() {
  const open = useAppSelector(
    (s) =>
      isBinaryDownloadStatus(s.downloader.status) || s.downloader.error !== null
  );

  return (
    <Dialog open={open}>
      <DialogTitle title="Updating Swap-CLI" />

      <DialogContent dividers>
        <InnerContent />
      </DialogContent>
    </Dialog>
  );
}
