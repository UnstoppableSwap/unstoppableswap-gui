import { Box, Button, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import SendIcon from '@material-ui/icons/Send';
import { useAppSelector } from '../../../../store/hooks';
import BitcoinIcon from '../../icons/BitcoinIcon';
import WithdrawDialog from '../../modal/wallet/WithdrawDialog';
import WalletRefreshButton from './WalletRefreshButton';

const useStyles = makeStyles((theme) => ({
  title: {
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  outer: {
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  inner: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(0.5),
  },
}));

export default function WithdrawWidget() {
  const classes = useStyles();
  const walletBalance = useAppSelector((state) => state.balance.balanceValue);
  const checkingBalance = useAppSelector(
    (state) => state.balance.processRunning
  );
  const [showDialog, setShowDialog] = useState(false);

  function onShowDialog() {
    setShowDialog(true);
  }

  return (
    <>
      <Paper variant="outlined" className={classes.outer}>
        <Typography variant="subtitle1" className={classes.title}>
          Wallet Balance
          <WalletRefreshButton />
        </Typography>
        <Box className={classes.inner}>
          <BitcoinIcon />
          <Typography variant="h5">
            {walletBalance === null ? '?' : walletBalance} BTC
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          size="large"
          onClick={onShowDialog}
          disabled={
            walletBalance === null || checkingBalance || walletBalance <= 0
          }
        >
          Withdraw
        </Button>
      </Paper>
      <WithdrawDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </>
  );
}
