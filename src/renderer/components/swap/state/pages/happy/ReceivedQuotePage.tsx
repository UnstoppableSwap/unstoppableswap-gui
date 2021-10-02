import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateReceivedQuote } from '../../../../../../models/store';

type ReceivedQuotePageProps = {
  state: SwapStateReceivedQuote;
};

export default function ReceivedQuotePage({ state }: ReceivedQuotePageProps) {
  return (
    <Box>
      <Typography variant="h5" align="center">
        Preparing multi signature wallet
      </Typography>
      <CircularProgress />
    </Box>
  );
}
