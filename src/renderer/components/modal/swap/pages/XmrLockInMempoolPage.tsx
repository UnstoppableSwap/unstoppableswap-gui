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
import { SwapStateXmrLockInMempool } from '../../../../../models/storeModel';
import MoneroIcon from '../../../icons/MoneroIcon';
import { isTestnet } from '../../../../../store/config';
import { getMoneroTxExplorerUrl } from '../../../../../utils/currencyUtils';

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
    gap: theme.spacing(0.5),
  },
  depositStatusText: {
    paddingTop: theme.spacing(0.5),
  },
}));

type XmrLockTxInMempoolPageProps = {
  state: SwapStateXmrLockInMempool;
};

export default function XmrLockTxInMempoolPage({
  state,
}: XmrLockTxInMempoolPageProps) {
  const classes = useStyles();

  return (
    <Box>
      <DialogContentText>
        The provider has published their Monero lock transaction. The swap will
        continue when the transaction is confirmed and the outputs unlocked.
      </DialogContentText>
      <Paper variant="outlined" className={classes.depositAddressOuter}>
        <Typography variant="subtitle1">XMR Lock Transaction</Typography>
        <Box className={classes.depositAddress}>
          <MoneroIcon />
          <Typography variant="h5">{state.aliceXmrLockTxId}</Typography>
        </Box>
        <LinearProgress variant="indeterminate" />
        <Typography variant="subtitle2" className={classes.depositStatusText}>
          Confirmations: {state.aliceXmrLockTxConfirmations}/10
        </Typography>
        <Typography variant="body1">
          <Link
            href={getMoneroTxExplorerUrl(state.aliceXmrLockTxId, isTestnet())}
            target="_blank"
          >
            View on explorer
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}