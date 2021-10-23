import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateXmrRedeemInMempool } from '../../../../../../../models/storeModel';
import { isTestnet } from '../../../../../../../store/config';
import { getMoneroTxExplorerUrl } from '../../../../../../../utils/currencyUtils';

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
          href={getMoneroTxExplorerUrl(state.bobXmrRedeemTxId, isTestnet())}
          target="_blank"
        >
          {state.bobXmrRedeemTxId}
        </Link>
      </Typography>
    </Box>
  );
}
