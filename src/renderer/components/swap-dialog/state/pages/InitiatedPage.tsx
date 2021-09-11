import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateInitiated } from '../../../../../swap/swap-state-machine';

type InitiatedPageProps = {
  state: SwapStateInitiated;
};

export default function InitiatedPage({ state }: InitiatedPageProps) {
  return (
    <Box>
      <Typography variant="h5">Connecting to swap provider</Typography>
      <CircularProgress />
      <Typography variant="body1">
        Multi addr: {state.provider.multiAddr}
        Peer Id: {state.provider.peerId}
      </Typography>
    </Box>
  );
}
