import {
  Box,
  DialogContentText,
  LinearProgress,
  Link,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { SwapStateBtcLockInMempool } from '../../../../../models/storeModel';
import BitcoinIcon from '../../../icons/BitcoinIcon';
import { isTestnet } from '../../../../../store/config';
import { getBitcoinTxExplorerUrl } from '../../../../../utils/currencyUtils';

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

export default function BitcoinLockTxInMempoolPage({
  state,
}: BitcoinLockTxInMempoolPageProps) {
  const classes = useStyles();

  return (
    <Box>
      <DialogContentText>
        The Bitcoin lock transaction has been published. The swap will continue
        automatically once the transaction is confirmed.
      </DialogContentText>
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
            href={getBitcoinTxExplorerUrl(state.bobBtcLockTxId, isTestnet())}
            target="_blank"
          >
            View on explorer
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
