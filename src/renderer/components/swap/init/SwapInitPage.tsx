import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { ChangeEvent, useEffect, useState } from 'react';
import SwapDialogTitle from '../SwapDialogTitle';
import {
  isBtcAddressValid,
  isXmrAddressValid,
} from '../../../../swap/utils/crypto-utils';
import { startSwap } from '../../../../swap/swap-process';
import { ExtendedProvider } from '../../../../models/store';
import { useAppSelector } from '../../../../store/hooks';
import { IS_TESTNET } from '../../../../store/store';

const useStyles = makeStyles((theme) => ({
  alertBox: {
    marginTop: theme.spacing(1),
  },
  redeemAddressField: {
    marginBottom: theme.spacing(2),
  },
}));

type FirstPageProps = {
  onClose: () => void;
  currentProvider: ExtendedProvider;
};

export default function SwapInitPage({
  onClose,
  currentProvider,
}: FirstPageProps) {
  const classes = useStyles();

  const [redeemAddress, setPayoutAddress] = useState(
    IS_TESTNET
      ? '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6'
      : ''
  );
  const [refundAddress, setRefundAddress] = useState(
    IS_TESTNET ? 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx' : ''
  );
  const [loading, setLoading] = useState(false);
  const swapState = useAppSelector((state) => state.swap.state);

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

  function getRedeemAddressError() {
    if (isXmrAddressValid(redeemAddress, IS_TESTNET)) {
      return null;
    }
    return 'Not a valid monero address';
  }

  function getRefundAddressError() {
    if (isBtcAddressValid(refundAddress, IS_TESTNET)) {
      return null;
    }
    return `Only bech32 addresses are supported. They begin with "${
      IS_TESTNET ? 'tb1' : 'bc1'
    }"`;
  }

  function handleSwapStart() {
    setLoading(true);
    startSwap(currentProvider, redeemAddress, refundAddress);
  }

  useEffect(() => {
    if (swapState) {
      onClose();
    }
  });

  return (
    <>
      <SwapDialogTitle title="Enter your addresses" />
      <DialogContent dividers>
        <TextField
          variant="outlined"
          label="Monero payout address"
          value={redeemAddress}
          onChange={handlePayoutChange}
          error={Boolean(getRedeemAddressError() && redeemAddress.length > 5)}
          fullWidth
          className={classes.redeemAddressField}
          placeholder={IS_TESTNET ? '59McWTPGc745...' : '888tNkZrPN6J...'}
          helperText={
            getRedeemAddressError() ||
            'The moneroj will be sent to this address'
          }
        />

        <TextField
          variant="outlined"
          label="Bitcoin refund address"
          value={refundAddress}
          onChange={handleRefundChange}
          error={Boolean(getRefundAddressError() && refundAddress.length > 5)}
          fullWidth
          placeholder={IS_TESTNET ? 'tb1q4aelwalu...' : 'bc18ociqZ9mZ...'}
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
        {IS_TESTNET ? (
          <Alert severity="info" className={classes.alertBox}>
            <AlertTitle>Testnet</AlertTitle>
            You are swapping testnet coins. Testnet coins are worthless and only
            used for testing.
          </Alert>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button
          disabled={Boolean(getRedeemAddressError() || getRefundAddressError())}
          onClick={handleSwapStart}
          color="primary"
          variant="contained"
        >
          {loading ? <CircularProgress /> : 'Next'}
        </Button>
      </DialogActions>
    </>
  );
}
