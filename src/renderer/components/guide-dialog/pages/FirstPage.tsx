import {
  Button,
  DialogActions,
  DialogContent,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { ChangeEvent, useState } from 'react';
import useStore, { Provider } from '../../../store';
import GuideDialogTitle from '../GuideDialogTitle';

function isXmrAddressValid(address: string, testnet: boolean) {
  const re = testnet
    ? '[57][0-9AB][1-9A-HJ-NP-Za-km-z]{93}'
    : '[48][0-9AB][1-9A-HJ-NP-Za-km-z]{93}';
  return new RegExp(`(?:^${re}$)`).test(address);
}

function isBtcAddressValid(address: string, testnet: boolean) {
  const re = testnet
    ? '(tb1)[a-zA-HJ-NP-Z0-9]{25,49}'
    : '(bc1)[a-zA-HJ-NP-Z0-9]{25,49}';
  return new RegExp(`(?:^${re}$)`).test(address);
}

const useStyles = makeStyles((theme) => ({
  alertBox: {
    marginTop: theme.spacing(1),
  },
  payoutAddressField: {
    marginBottom: theme.spacing(2),
  },
}));

export default function FirstPage() {
  const classes = useStyles();

  const setDialog = useStore((state) => state.setDialog);
  const dialog = useStore((state) => state.dialog);
  const currentProvider = useStore(
    (state) => state.currentProvider
  ) as Provider;
  const [payoutAddress, setPayoutAddress] = useState('');
  const [refundAddress, setRefundAddress] = useState('');

  function handlePayoutChange(event: ChangeEvent<HTMLInputElement>) {
    let text = event.target.value.trim();
    if (text.toLowerCase().startsWith('monero:')) {
      text = text.substring(7);
    }
    setPayoutAddress(text);
  }

  function handleRefundChange(event: ChangeEvent<HTMLInputElement>) {
    const text = event.target.value.trim();
    setRefundAddress(text);
  }

  function getPayoutAddressError() {
    if (
      isXmrAddressValid(payoutAddress, currentProvider.testnet) ||
      payoutAddress.length < 5
    ) {
      return null;
    }
    return 'Not a valid monero address';
  }

  const getRefundAddressError = () => {
    if (
      isBtcAddressValid(refundAddress, currentProvider.testnet) ||
      refundAddress.length < 5
    ) {
      return null;
    }
    return `Only bech32 addresses are supported. They begin with "${
      currentProvider.testnet ? 'tb1' : 'bc1'
    }"`;
  };

  return (
    <>
      <GuideDialogTitle title="Enter your addresses" />
      <DialogContent dividers>
        <TextField
          variant="outlined"
          label="Monero payout address"
          value={payoutAddress}
          onChange={handlePayoutChange}
          error={!!getPayoutAddressError()}
          fullWidth
          className={classes.payoutAddressField}
          placeholder={
            currentProvider.testnet ? '59McWTPGc745...' : '888tNkZrPN6J...'
          }
          helperText={
            getPayoutAddressError() ||
            'The moneroj will be sent to this address'
          }
        />

        <TextField
          variant="outlined"
          label="Bitcoin refund address"
          value={refundAddress}
          onChange={handleRefundChange}
          error={!!getRefundAddressError()}
          fullWidth
          placeholder={
            currentProvider.testnet ? 'tb1q4aelwalu...' : 'bc18ociqZ9mZ...'
          }
          helperText={
            getRefundAddressError() ||
            'In case something goes wrong all BTC is refunded to this address'
          }
        />

        <Alert severity="warning" className={classes.alertBox}>
          <AlertTitle>Attention</AlertTitle>
          Double check the XMR address — funds sent to the wrong address
          can&apos;t be recovered
        </Alert>
        {currentProvider.testnet ? (
          <Alert severity="info" className={classes.alertBox}>
            <AlertTitle>Testnet</AlertTitle>
            This swap provider only trades testnet coins. They don&apos;t hold
            any value. If you want to swap real coins switch to a mainnet swap
            provider.
          </Alert>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setDialog({ ...dialog, open: false })}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
