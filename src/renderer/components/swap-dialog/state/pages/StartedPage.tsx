import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

export default function StartedPage() {
  return (
    <Box>
      <Typography variant="h5" align="center">
        Locking your Bitcoin
      </Typography>
      <CircularProgress />
    </Box>
  );
}
