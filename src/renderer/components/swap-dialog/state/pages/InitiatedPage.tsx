import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateInitiated } from '../../../../../models/store';

type InitiatedPageProps = {
  state: SwapStateInitiated;
};

export default function InitiatedPage({ state }: InitiatedPageProps) {
  return (
    <Box>
      <Typography variant="h5">Connecting to swap provider</Typography>
      <CircularProgress />
    </Box>
  );
}
