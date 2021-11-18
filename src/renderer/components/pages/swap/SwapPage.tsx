import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import SwapWidget from './SwapWidget';

const useStyles = makeStyles({
  outer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default function SwapPage() {
  const classes = useStyles();

  return (
    <Box className={classes.outer}>
      <SwapWidget />
    </Box>
  );
}
