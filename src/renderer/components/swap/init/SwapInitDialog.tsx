import React from 'react';
import { Dialog, useMediaQuery, useTheme } from '@material-ui/core';
import SwapInitPage from './SwapInitPage';
import { ExtendedProvider } from '../../../../models/storeModel';

export default function SwapInitDialog({
  open,
  onClose,
  currentProvider,
}: {
  open: boolean;
  onClose: () => void;
  currentProvider: ExtendedProvider;
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
      <SwapInitPage onClose={onClose} currentProvider={currentProvider} />
    </Dialog>
  );
}
