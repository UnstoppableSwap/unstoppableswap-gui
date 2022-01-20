import { Box, Button, DialogContentText, makeStyles } from '@material-ui/core';
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import MoneroAddressTextField from '../../../inputs/MoneroAddressTextField';
import BitcoinAddressTextField from '../../../inputs/BitcoinAddressTextField';
import { useAppSelector } from '../../../../../store/hooks';
import { isTestnet } from '../../../../../store/config';

const useStyles = makeStyles((theme) => ({
  initButton: {
    marginTop: theme.spacing(1),
  },
}));

export default function InitPage() {
  const classes = useStyles();
  const [redeemAddress, setRedeemAddress] = useState(
    isTestnet() && process.env.TESTNET_PREFILL_XMR_ADDRESS
      ? process.env.TESTNET_PREFILL_XMR_ADDRESS
      : ''
  );
  const [refundAddress, setRefundAddress] = useState(
    isTestnet() && process.env.TESTNET_PREFILL_BTC_ADDRESS
      ? process.env.TESTNET_PREFILL_BTC_ADDRESS
      : ''
  );
  const [redeemAddressValid, setRedeemAddressValid] = useState(false);
  const [refundAddressValid, setRefundAddressValid] = useState(false);
  const selectedProvider = useAppSelector(
    (state) => state.providers.selectedProvider
  );

  async function handleSwapStart() {
    if (selectedProvider) {
      try {
        await ipcRenderer.invoke(
          'spawn-buy-xmr',
          selectedProvider,
          redeemAddress,
          refundAddress
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <Box>
      <DialogContentText>
        Fill in your Monero and Bitcoin addresses. They will be used only for
        this swap.
      </DialogContentText>

      <MoneroAddressTextField
        address={redeemAddress}
        onAddressChange={setRedeemAddress}
        onAddressValidityChange={setRedeemAddressValid}
        helperText="The monero will be sent to this address"
        fullWidth
      />

      <BitcoinAddressTextField
        address={refundAddress}
        onAddressChange={setRefundAddress}
        onAddressValidityChange={setRefundAddressValid}
        helperText="In case something goes terribly wrong, all Bitcoin will be refunded to this address"
        fullWidth
      />

      <Button
        disabled={
          !refundAddressValid || !redeemAddressValid || !selectedProvider
        }
        onClick={handleSwapStart}
        variant="contained"
        color="primary"
        size="large"
        className={classes.initButton}
      >
        Start swap
      </Button>
    </Box>
  );
}