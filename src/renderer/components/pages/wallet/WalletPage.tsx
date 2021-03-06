import { Typography } from '@material-ui/core';
import WithdrawWidget from './WithdrawWidget';

export default function WalletPage() {
  return (
    <>
      <Typography variant="h3">Wallet</Typography>
      <Typography variant="subtitle1">
        These funds will automatically be used when starting a new swap. You can
        also sweep the wallet and withdraw the Bitcoin to an external wallet.
      </Typography>
      <WithdrawWidget />
    </>
  );
}
