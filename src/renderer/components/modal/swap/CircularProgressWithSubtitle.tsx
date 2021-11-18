import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

export default function CircularProgressWithSubtitle({
  description,
}: {
  description: string;
}) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <CircularProgress size={50} />
      <Typography variant="subtitle2">{description}</Typography>
    </Box>
  );
}
