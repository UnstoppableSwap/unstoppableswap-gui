import { ChangeEvent, useState } from 'react';
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import { Multiaddr } from 'multiaddr';
import IpcInvokeButton from '../../IpcInvokeButton';

type ListSellersDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function ListSellersDialog({
  open,
  onClose,
}: ListSellersDialogProps) {
  const [rendezvousAddress, setRendezvousAddress] = useState('');

  function handleMultiAddrChange(event: ChangeEvent<HTMLInputElement>) {
    setRendezvousAddress(event.target.value);
  }

  function getMultiAddressError(): string | null {
    try {
      const multiAddress = new Multiaddr(rendezvousAddress);
      if (!multiAddress.protoNames().includes('p2p')) {
        return 'The multi address must contain the peer id (/p2p/)';
      }
      return null;
    } catch (e) {
      return 'Not a valid multi address';
    }
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Submit a swap provider</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          You can manually connect to a rendezvous point to discover swap
          providers
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Rendezvous point"
          fullWidth
          helperText={
            getMultiAddressError() || 'Multiaddr of the rendezvous point'
          }
          value={rendezvousAddress}
          onChange={handleMultiAddrChange}
          placeholder="/dns4/discover.unstoppableswap.net/tcp/8888/p2p/12D3KooWA6cnqJpVnreBVnoro8midDL9Lpzmg8oJPoAGi7YYaamE"
          error={!!getMultiAddressError()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <IpcInvokeButton
          variant="contained"
          disabled={!(rendezvousAddress && !getMultiAddressError())}
          color="primary"
          onSuccess={onClose}
          ipcChannel="spawn-list-sellers"
          ipcArgs={[rendezvousAddress]}
        >
          Connect
        </IpcInvokeButton>
      </DialogActions>
    </Dialog>
  );
}
