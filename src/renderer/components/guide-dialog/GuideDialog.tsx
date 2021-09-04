import React from 'react';
import { Dialog, useMediaQuery, useTheme } from '@material-ui/core';
import useStore from '../../store';
import FirstPage from './pages/FirstPage';

function CurrentPage({ page }: { page: number }) {
  switch (page) {
    case 0:
      return <FirstPage />;
    default:
      return null;
  }
}

export default function GuideDialog() {
  const dialog = useStore((state) => state.dialog);
  const setDialog = useStore((state) => state.setDialog);
  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setDialog({
      amount: 0,
      open: false,
      page: 0,
      payoutAddress: null,
      refundAddress: null,
    });
  };

  return (
    <Dialog
      open={dialog.open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={smallDevice}
    >
      <CurrentPage page={dialog.page} />
    </Dialog>
  );
}
