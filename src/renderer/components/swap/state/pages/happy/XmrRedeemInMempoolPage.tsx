import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateXmrRedeemInMempool } from '../../../../../../models/store';
import { useAppSelector } from '../../../../../../store/hooks';
import { getMoneroTxExplorerUrl } from '../../../../../utils/blockexplorer-utils';

type XmrRedeemInMempoolPageProps = {
  state: SwapStateXmrRedeemInMempool;
};

export default function XmrRedeemInMempoolPage({
  state,
}: XmrRedeemInMempoolPageProps) {
  const provider = useAppSelector((s) => s.swap.provider);

  return (
    <Box>
      <Typography variant="h5">
        Monero redeem transaction has been published
      </Typography>
      <Typography variant="body1">
        TxId:{' '}
        <Link
          href={getMoneroTxExplorerUrl(
            state.bobXmrRedeemTxId,
            Boolean(provider?.testnet)
          )}
          target="_blank"
        >
          {state.bobXmrRedeemTxId}
        </Link>
      </Typography>
    </Box>
  );
}
