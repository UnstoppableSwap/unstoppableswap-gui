import { Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useAppSelector } from '../../../../store/hooks';

export default function WalletPage() {
  const walletBalance = useAppSelector((state) => state.balance.balanceValue);

  useEffect(() => {
    ipcRenderer.invoke('spawn-balance-check');
  }, []);

  return (
    <>
      <Typography variant="h3">Wallet</Typography>
      <Typography variant="subtitle1">
        Manage the funds of the internal wallet
      </Typography>
      <Typography>Balance: {walletBalance} BTC</Typography>
    </>
  );
}
