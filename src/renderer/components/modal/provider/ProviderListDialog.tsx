import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import ProviderInfo from './ProviderInfo';
import { ExtendedProviderStatus } from '../../../../models/apiModel';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setSelectedProvider } from '../../../../store/features/providersSlice';
import ProviderSubmitDialog from './ProviderSubmitDialog';
import ListSellersDialog from '../listSellers/ListSellersDialog';

const useStyles = makeStyles({
  dialogContent: {
    padding: 0,
  },
});

type ProviderSelectDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ProviderSubmitDialogOpenButton() {
  const [open, setOpen] = useState(false);

  return (
    <ListItem
      autoFocus
      button
      onClick={() => {
        // Prevents background from being clicked and reopening dialog
        if (!open) {
          setOpen(true);
        }
      }}
    >
      <ProviderSubmitDialog open={open} onClose={() => setOpen(false)} />
      <ListItemAvatar>
        <Avatar>
          <AddIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary="Add a new provider to public registry" />
    </ListItem>
  );
}

export function ListSellersDialogOpenButton() {
  const [open, setOpen] = useState(false);
  const running = useAppSelector((state) => state.listSellers.processRunning);

  return (
    <ListItem
      autoFocus
      button
      disabled={running}
      onClick={() => {
        // Prevents background from being clicked and reopening dialog
        if (!open) {
          setOpen(true);
        }
      }}
    >
      <ListSellersDialog open={open} onClose={() => setOpen(false)} />
      <ListItemAvatar>
        <Avatar>{running ? <CircularProgress /> : <SearchIcon />}</Avatar>
      </ListItemAvatar>
      <ListItemText primary="Discover providers by connecting to a rendezvous point" />
    </ListItem>
  );
}

export default function ProviderListDialog({
  open,
  onClose,
}: ProviderSelectDialogProps) {
  const classes = useStyles();
  const providers = useAppSelector((state) => {
    const registryProviders = state.providers.providers || [];
    const listSellersProviders = state.listSellers.sellers || [];
    const listSellersProvidersWithoutDuplicates = listSellersProviders.filter(
      (listSellersProvider) =>
        !registryProviders.find(
          (registryProvider) =>
            registryProvider.peerId === listSellersProvider.peerId
        )
    );
    return [...registryProviders, ...listSellersProvidersWithoutDuplicates];
  });
  const dispatch = useAppDispatch();

  function handleProviderChange(provider: ExtendedProviderStatus) {
    dispatch(setSelectedProvider(provider));
    onClose();
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Select a swap provider</DialogTitle>

      <DialogContent className={classes.dialogContent} dividers>
        <List>
          {providers.map((provider) => (
            <ListItem
              button
              onClick={() => handleProviderChange(provider)}
              key={provider.peerId}
            >
              <ProviderInfo provider={provider} key={provider.peerId} />
            </ListItem>
          ))}
          <ListSellersDialogOpenButton />
          <ProviderSubmitDialogOpenButton />
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
