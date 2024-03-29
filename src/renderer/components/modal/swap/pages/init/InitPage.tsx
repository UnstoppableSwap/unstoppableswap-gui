import { Box, Button, DialogContentText, makeStyles } from '@material-ui/core';
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import BitcoinAddressTextField from 'renderer/components/inputs/BitcoinAddressTextField';
import MoneroAddressTextField from 'renderer/components/inputs/MoneroAddressTextField';
import { useAppSelector } from 'store/hooks';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { isTestnet } from '../../../../../../store/config';
import RemainingFundsWillBeUsedAlert from '../../../../alert/RemainingFundsWillBeUsedAlert';

const useStyles = makeStyles((theme) => ({
  initButton: {
    marginTop: theme.spacing(1),
  },
  fieldsOuter: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export default function InitPage() {
  const classes = useStyles();
  const [redeemAddress, setRedeemAddress] = useState(
    isTestnet() && process.env.TESTNET_AUTOFILL_XMR_ADDRESS
      ? process.env.TESTNET_AUTOFILL_XMR_ADDRESS
      : ''
  );
  const [refundAddress, setRefundAddress] = useState(
    isTestnet() && process.env.TESTNET_AUTOFILL_BTC_ADDRESS
      ? process.env.TESTNET_AUTOFILL_BTC_ADDRESS
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
      <RemainingFundsWillBeUsedAlert />
      <DialogContentText>
        Please specify the address to which the Monero should be sent upon
        completion of the swap and the address for receiving a Bitcoin refund if
        the swap fails.
      </DialogContentText>

      <Box className={classes.fieldsOuter}>
        <MoneroAddressTextField
          label="Monero redeem address"
          address={redeemAddress}
          onAddressChange={setRedeemAddress}
          onAddressValidityChange={setRedeemAddressValid}
          helperText="The monero will be sent to this address"
          fullWidth
        />

        <BitcoinAddressTextField
          label="Bitcoin refund address"
          address={refundAddress}
          onAddressChange={setRefundAddress}
          onAddressValidityChange={setRefundAddressValid}
          helperText="In case something goes terribly wrong, all Bitcoin will be refunded to this address"
          fullWidth
        />
      </Box>

      <Button
        disabled={
          !refundAddressValid || !redeemAddressValid || !selectedProvider
        }
        onClick={handleSwapStart}
        variant="contained"
        color="primary"
        size="large"
        className={classes.initButton}
        endIcon={<PlayArrowIcon />}
      >
        Start swap
      </Button>
    </Box>
  );
}
