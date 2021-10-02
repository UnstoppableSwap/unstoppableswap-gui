import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

export default function InitiatedPage() {
  return (
    <Box>
      <Typography variant="h5" align="center">
        Requesting quote
      </Typography>
      <CircularProgress />
    </Box>
  );
}
