import { Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import spawnBalanceCheck from '../../../../swap/commands/balanceCommand';

export default function WalletPage() {
  const walletBalance = useAppSelector((state) => state.balance.balanceValue);

  useEffect(() => {
    spawnBalanceCheck();

    const intervalId = setInterval(spawnBalanceCheck, 1000 * 30);

    return () => clearInterval(intervalId);
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
