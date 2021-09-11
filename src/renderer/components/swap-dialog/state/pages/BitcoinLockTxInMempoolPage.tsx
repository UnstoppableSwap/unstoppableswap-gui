import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateBtcLockInMempool } from '../../../../../swap/swap-state-machine';

type BitcoinLockTxInMempoolPageProps = {
  state: SwapStateBtcLockInMempool;
};

export default function BitcoinLockTxInMempoolPage({
  state,
}: BitcoinLockTxInMempoolPageProps) {
  return (
    <Box>
      <Typography variant="h5">
        Waiting for Bitcoin lock transaction be confirmed
      </Typography>
      <Typography variant="body1">
        TxId:{' '}
        <Link
          href={`https://blockchair.com/bitcoin${
            state.provider.testnet ? '/testnet' : ''
          }/transaction/${state.bobBtcLockTxId}`}
          target="_blank"
        >
          {state.bobBtcLockTxId}
        </Link>
      </Typography>
      <Typography variant="body1">
        Confirmations: {state.bobBtcLockTxConfirmations}
      </Typography>
    </Box>
  );
}
