import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateXmrRedeemInMempool } from '../../../../../../models/store';
import { getMoneroTxExplorerUrl } from '../../../../../utils/blockexplorer-utils';
import { IS_TESTNET } from '../../../../../../store/store';

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
          href={getMoneroTxExplorerUrl(state.bobXmrRedeemTxId, IS_TESTNET)}
          target="_blank"
        >
          {state.bobXmrRedeemTxId}
        </Link>
      </Typography>
    </Box>
  );
}
