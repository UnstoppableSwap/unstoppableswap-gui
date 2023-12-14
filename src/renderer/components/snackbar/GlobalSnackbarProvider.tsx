import {
  MaterialDesignContent,
  SnackbarKey,
  SnackbarProvider,
  useSnackbar,
} from 'notistack';
import { IconButton, styled } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ReactNode } from 'react';
import IpcSnackbar from './IpcSnackbar';
import ListSellersSnackbar from './ListSellersSnackbar';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent': {
    maxWidth: '50vw',
  },
}));

function CloseSnackbarButton({ snackbarId }: { snackbarId: SnackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarId)}>
      <Close />
    </IconButton>
  );
}

export default function GlobalSnackbarManager({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SnackbarProvider
      action={(snackbarId) => <CloseSnackbarButton snackbarId={snackbarId} />}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        default: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent,
        warning: StyledMaterialDesignContent,
      }}
    >
      <ListSellersSnackbar />
      <IpcSnackbar />
      {children}
    </SnackbarProvider>
  );
}
