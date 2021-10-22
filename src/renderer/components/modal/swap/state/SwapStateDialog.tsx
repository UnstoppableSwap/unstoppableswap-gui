import React from 'react';
import { Dialog, useMediaQuery, useTheme } from '@material-ui/core';
import SwapStatePage from './SwapStatePage';
import { useAppSelector } from '../../../../../store/hooks';

export default function SwapStateDialog() {
  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const swap = useAppSelector((state) => state.swap);

  if (swap.state) {
    return (
      <Dialog
        open
        onClose={() => {}}
        maxWidth="md"
        fullWidth
        fullScreen={smallDevice}
      >
        <SwapStatePage swap={swap} />
      </Dialog>
    );
  }
  return <></>;
}
