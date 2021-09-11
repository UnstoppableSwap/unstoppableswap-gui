import React from 'react';
import { Dialog, useMediaQuery, useTheme } from '@material-ui/core';
import useStore from 'renderer/store';
import SwapStatePage from './SwapStatePage';

export default function SwapStateDialog() {
  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const swapState = useStore((state) => state.swapState);

  if (swapState) {
    return (
      <Dialog
        open={Boolean(swapState)}
        onClose={() => {}}
        maxWidth="md"
        fullWidth
        fullScreen={smallDevice}
      >
        <SwapStatePage state={swapState} />
      </Dialog>
    );
  }
  return <></>;
}
