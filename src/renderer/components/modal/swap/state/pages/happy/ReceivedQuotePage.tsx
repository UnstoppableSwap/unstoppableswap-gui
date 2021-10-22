import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

export default function ReceivedQuotePage() {
  return (
    <Box>
      <Typography variant="h5" align="center">
        Preparing multi signature wallet
      </Typography>
      <CircularProgress />
    </Box>
  );
}
