import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateXmrRedeemInMempool } from '../../../../../models/store';

type XmrRedeemInMempoolPageProps = {
  state: SwapStateXmrRedeemInMempool;
};

export default function XmrRedeemInMempoolPage({
  state,
}: XmrRedeemInMempoolPageProps) {
  return (
    <Box>
      <Typography variant="h5">
        Monero redeem transaction has been published
      </Typography>
      <Typography variant="body1">
        TxId:{' '}
        <Link
          href={`${
            state.provider.testnet
              ? 'https://stagenet.xmrchain.net'
              : 'https://xmrchain.net'
          }/tx/${state.bobXmrRedeemTxId}`}
          target="_blank"
        >
          {state.bobXmrRedeemTxId}
        </Link>
      </Typography>
    </Box>
  );
}
