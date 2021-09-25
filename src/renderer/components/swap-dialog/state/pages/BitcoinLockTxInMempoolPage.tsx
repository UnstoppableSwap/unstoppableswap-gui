import {
  Box,
  LinearProgress,
  Link,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { SwapStateBtcLockInMempool } from '../../../../../models/store';
import { useAppSelector } from '../../../../../store/hooks';
import BitcoinIcon from '../../../icons/BitcoinIcon';

const useStyles = makeStyles((theme) => ({
  depositAddressOuter: {
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  depositAddress: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    alignItems: 'center',
    display: 'flex',
    '& > *': {
      paddingRight: theme.spacing(0.25),
    },
  },
  depositStatusText: {
    paddingTop: theme.spacing(0.5),
  },
}));

type BitcoinLockTxInMempoolPageProps = {
  state: SwapStateBtcLockInMempool;
};

function getBlockchairUrl(txid: string, testnet: boolean) {
  return `https://blockchair.com/bitcoin${
    testnet ? '/testnet' : ''
  }/transaction/${txid}`;
}

export default function BitcoinLockTxInMempoolPage({
  state,
}: BitcoinLockTxInMempoolPageProps) {
  const provider = useAppSelector((s) => s.swap.provider);
  const classes = useStyles();

  return (
    <Box>
      <Typography variant="h5" align="center">
        Waiting for Bitcoin lock confirmations
      </Typography>
      <Paper variant="outlined" className={classes.depositAddressOuter}>
        <Typography variant="subtitle1">BTC Lock Transaction</Typography>
        <Box className={classes.depositAddress}>
          <BitcoinIcon />
          <Typography variant="h5">{state.bobBtcLockTxId}</Typography>
        </Box>
        <LinearProgress variant="indeterminate" />
        <Typography variant="subtitle2" className={classes.depositStatusText}>
          Most swap providers require 2 confirmations
          <br />
          Confirmations: {state.bobBtcLockTxConfirmations}
        </Typography>
        <Typography variant="body1">
          <Link
            href={getBlockchairUrl(
              state.bobBtcLockTxId,
              Boolean(provider?.testnet)
            )}
            target="_blank"
          >
            View on explorer
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
