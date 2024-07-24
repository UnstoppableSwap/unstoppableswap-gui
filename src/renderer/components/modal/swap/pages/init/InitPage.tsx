import { Box, DialogContentText, makeStyles, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { useState } from 'react';
import BitcoinAddressTextField from 'renderer/components/inputs/BitcoinAddressTextField';
import MoneroAddressTextField from 'renderer/components/inputs/MoneroAddressTextField';
import { useAppSelector } from 'store/hooks';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { isTestnet } from 'store/config';
import RemainingFundsWillBeUsedAlert from '../../../../alert/RemainingFundsWillBeUsedAlert';
import IpcInvokeButton from '../../../../IpcInvokeButton';

const useStyles = makeStyles((theme) => ({
  initButton: {
    marginTop: theme.spacing(1),
  },
  fieldsOuter: {
    paddingTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export default function InitPage() {
  const selectedProvider = useAppSelector(
    (state) => state.providers.selectedProvider,
  );
  const classes = useStyles();
  
  const [redeemAddress, setRedeemAddress] = useState(
    isTestnet() && process.env.TESTNET_AUTOFILL_XMR_ADDRESS
      ? process.env.TESTNET_AUTOFILL_XMR_ADDRESS
      : '',
  );
  const [refundAddress, setRefundAddress] = useState(
    isTestnet() && process.env.TESTNET_AUTOFILL_BTC_ADDRESS
      ? process.env.TESTNET_AUTOFILL_BTC_ADDRESS
      : '',
  );
  const [redeemAddressValid, setRedeemAddressValid] = useState(false);
  const [refundAddressValid, setRefundAddressValid] = useState(false);
  const [useExternalRefundAddress, setUseExternalRefundAddress] = useState(false);

  return (
    <Box>
      <RemainingFundsWillBeUsedAlert />
      <Box className={classes.fieldsOuter}>
        <MoneroAddressTextField
          label="Monero redeem address"
          address={redeemAddress}
          onAddressChange={setRedeemAddress}
          onAddressValidityChange={setRedeemAddressValid}
          helperText="The monero will be sent to this address if the swap is successful."
          fullWidth
        />

        <Paper variant="outlined" style={{ }}>
          <Tabs value={useExternalRefundAddress ? 1 : 0} indicatorColor='primary' variant='fullWidth' onChange={(_, newValue) => setUseExternalRefundAddress(newValue === 1)}>
            <Tab label="Refund to internal Bitcoin wallet" value={0} />
            <Tab label="Refund to external Bitcoin address" value={1} />
          </Tabs>
          <Box style={{ padding: '16px' }}>
            {
              useExternalRefundAddress ? (
                <BitcoinAddressTextField
                  label="External Bitcoin refund address"
                  address={refundAddress}
                  onAddressChange={setRefundAddress}
                  onAddressValidityChange={setRefundAddressValid}
                  helperText="In case something goes wrong, the Bitcoin will be refunded to this address."
                  fullWidth
                />
              ) : (
                <Typography variant="caption">
                  In case something goes wrong, the Bitcoin will be refunded to the internal Bitcoin wallet of the GUI. You can then withdraw them from there or use them for another swap directly.
                </Typography>
              )
            }
          </Box>
        </Paper>
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center' }}> 
        <IpcInvokeButton
          disabled={
            (!refundAddressValid && useExternalRefundAddress) ||
            !redeemAddressValid ||
            !selectedProvider
          }
          variant="contained"
          color="primary"
          size="large"
          className={classes.initButton}
          endIcon={<PlayArrowIcon />}
          ipcChannel="spawn-buy-xmr"
          ipcArgs={[selectedProvider, redeemAddress, useExternalRefundAddress ? refundAddress : null]}
          displayErrorSnackbar={false}
        >
          Request quote and start swap
        </IpcInvokeButton>
      </Box>
    </Box>
  );
}
