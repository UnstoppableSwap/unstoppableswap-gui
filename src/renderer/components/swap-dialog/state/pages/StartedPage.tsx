import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

export default function StartedPage() {
  return (
    <Box>
      <Typography variant="h5">
        Signing and publishing Bitcoin lock transaction
      </Typography>
      <CircularProgress />
    </Box>
  );
}
