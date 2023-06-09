import { SnackbarProvider, useSnackbar } from 'notistack';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ReactNode } from 'react';
import IpcSnackbar from './IpcSnackbar';
import ListSellersSnackbar from './ListSellersSnackbar';

export default function GlobalSnackbarManager({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SnackbarProvider
      action={(snackbarId) => {
        const { closeSnackbar } = useSnackbar();

        return (
          <IconButton onClick={() => closeSnackbar(snackbarId)}>
            <Close />
          </IconButton>
        );
      }}
    >
      <ListSellersSnackbar />
      <IpcSnackbar />
      {children}
    </SnackbarProvider>
  );
}
