import React from 'react';
import { Dialog, useMediaQuery, useTheme } from '@material-ui/core';
import SwapInitPage from './SwapInitPage';

export default function SwapInitDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={smallDevice}
    >
      <SwapInitPage onClose={onClose} />
    </Dialog>
  );
}
