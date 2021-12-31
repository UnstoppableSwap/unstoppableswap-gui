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
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ProviderInfo from './ProviderInfo';
import { ExtendedProvider } from '../../../../models/storeModel';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setSelectedProvider } from '../../../../store/features/providersSlice';

const useStyles = makeStyles({
  dialogContent: {
    padding: 0,
  },
});

type ProviderSelectDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmitDialogOpen: () => void;
};

export default function ProviderSelectDialog({
  open,
  onClose,
  onSubmitDialogOpen,
}: ProviderSelectDialogProps) {
  const classes = useStyles();
  const providers = useAppSelector((state) => state.providers.providers);
  const dispatch = useAppDispatch();

  function handleProviderChange(provider: ExtendedProvider) {
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
          <ListItem autoFocus button onClick={onSubmitDialogOpen}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Submit a swap provider" />
          </ListItem>
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
