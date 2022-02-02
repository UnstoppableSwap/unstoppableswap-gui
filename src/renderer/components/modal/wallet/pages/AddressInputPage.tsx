import { useState } from 'react';
import { Button, DialogActions, DialogContentText } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import BitcoinAddressTextField from '../../../inputs/BitcoinAddressTextField';
import WithdrawDialogContent from '../WithdrawDialogContent';

export default function AddressInputPage({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const [withdrawAddressValid, setWithdrawAddressValid] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');

  async function spawnWithdraw() {
    await ipcRenderer.invoke('spawn-withdraw-btc', withdrawAddress);
  }

  return (
    <>
      <WithdrawDialogContent>
        <DialogContentText>
          To withdraw the BTC of the internal wallet, please enter an address.
          All funds will be sent to that address.
        </DialogContentText>

        <BitcoinAddressTextField
          address={withdrawAddress}
          onAddressChange={setWithdrawAddress}
          onAddressValidityChange={setWithdrawAddressValid}
          helperText="All Bitcoin of the internal wallet will be transferred to this address"
          fullWidth
        />
      </WithdrawDialogContent>

      <DialogActions>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
        <Button
          disabled={!withdrawAddressValid}
          onClick={spawnWithdraw}
          color="primary"
          variant="contained"
        >
          Withdraw
        </Button>
      </DialogActions>
    </>
  );
}
