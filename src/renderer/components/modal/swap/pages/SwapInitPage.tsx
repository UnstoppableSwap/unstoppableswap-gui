import { Box, Button, DialogContentText, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { ExtendedProvider } from 'models/storeModel';
import MoneroAddressTextField from '../../../inputs/MoneroAddressTextField';
import BitcoinAddressTextField from '../../../inputs/BitcoinAddressTextField';

const useStyles = makeStyles((theme) => ({
  initButton: {
    marginTop: theme.spacing(1),
  },
}));

export default function SwapInitPage({
  currentProvider,
}: {
  currentProvider: ExtendedProvider;
}) {
  const classes = useStyles();
  const [redeemAddress, setRedeemAddress] = useState(
    '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6'
  );
  const [redeemAddressValid, setRedeemAddressValid] = useState(false);
  const [refundAddress, setRefundAddress] = useState(
    'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx'
  );
  const [refundAddressValid, setRefundAddressValid] = useState(false);

  async function handleSwapStart() {
    try {
      await ipcRenderer.invoke(
        'spawn-buy-xmr',
        currentProvider,
        redeemAddress,
        refundAddress
      );
    } catch (e) {
      console.error(e);
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
        disabled={!refundAddressValid || !redeemAddressValid}
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
