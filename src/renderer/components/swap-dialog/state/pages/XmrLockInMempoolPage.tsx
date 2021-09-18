import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateXmrLockInMempool } from '../../../../../models/store';

type XmrLockTxInMempoolPageProps = {
  state: SwapStateXmrLockInMempool;
};

export default function XmrLockTxInMempoolPage({
  state,
}: XmrLockTxInMempoolPageProps) {
  return (
    <Box>
      <Typography variant="h5">
        Waiting for Monero lock transaction be confirmed
      </Typography>
      <Typography variant="body1">
        TxId:{' '}
        <Link
          href={`${
            state.provider.testnet
              ? 'https://stagenet.xmrchain.net'
              : 'https://xmrchain.net'
          }/tx/${state.aliceXmrLockTxId}`}
          target="_blank"
        >
          {state.aliceXmrLockTxId}
        </Link>
      </Typography>
      <Typography variant="body1">
        Confirmations: {state.aliceXmrLockTxConfirmations}
      </Typography>
    </Box>
  );
}
