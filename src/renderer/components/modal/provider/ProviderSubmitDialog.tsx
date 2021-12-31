import { ChangeEvent, useState } from 'react';
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  FormControlLabel,
  DialogActions,
  Button,
  Switch,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import { Multiaddr } from 'multiaddr';

type ProviderSubmitDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function ProviderSubmitDialog({
  open,
  onClose,
}: ProviderSubmitDialogProps) {
  const [multiAddr, setMultiAddr] = useState('');
  const [peerId, setPeerId] = useState('');
  const [testnet, setTestnet] = useState(true);

  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  async function handleProviderSubmit() {
    if (multiAddr && peerId) {
      await fetch('/api/submit-provider', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          multiAddr,
          peerId,
          testnet,
        }),
      });
      setMultiAddr('');
      setPeerId('');
      onClose();
    }
  }

  function handleMultiAddrChange(event: ChangeEvent<HTMLInputElement>) {
    setMultiAddr(event.target.value);
  }

  function handlePeerIdChange(event: ChangeEvent<HTMLInputElement>) {
    setPeerId(event.target.value);
  }

  const handleTestnetCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setTestnet(event.target.checked);
  };

  function getMultiAddressError(): string | null {
    try {
      const multiAddress = new Multiaddr(multiAddr);
      if (multiAddress.protoNames().includes('p2p')) {
        return 'The multi address should not contain the peer id (/p2p/)';
      }
      if (multiAddress.protoNames().find((name) => name.includes('onion'))) {
        return 'It is currently not possible to add an onion only ASB';
      }
      return null;
    } catch (e) {
      return 'Not a valid multi address';
    }
  }

  return (
    <Dialog onClose={onClose} open={open} fullScreen={smallDevice}>
      <DialogTitle>Submit a swap provider</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          If the ASB is valid, it will be displayed to all other users to trade
          with.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Multiaddress"
          fullWidth
          helperText={
            getMultiAddressError() ||
            'Tells the swap client where your ASB can be reached'
          }
          value={multiAddr}
          onChange={handleMultiAddrChange}
          placeholder="/ip4/182.3.21.93/tcp/9939"
          error={!!getMultiAddressError()}
        />
        <TextField
          margin="dense"
          label="Peer ID"
          fullWidth
          helperText="Identifies your ASB and allows for secure communication"
          value={peerId}
          onChange={handlePeerIdChange}
          placeholder="12D3KooWCdMKjesXMJz1SiZ7HgotrxuqhQJbP5sgBm2BwP1cqThi"
        />
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={testnet}
              onChange={handleTestnetCheckboxChange}
            />
          }
          label="Testnet"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleProviderSubmit}
          disabled={!(multiAddr && peerId && !getMultiAddressError())}
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
