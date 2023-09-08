import {
  MaterialDesignContent,
  SnackbarProvider,
  useSnackbar,
} from 'notistack';
import { IconButton, styled } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ReactNode } from 'react';
import IpcSnackbar from './IpcSnackbar';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent': {
    maxWidth: '50vw',
  },
}));

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
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        default: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent,
        warning: StyledMaterialDesignContent,
      }}
    >
      <IpcSnackbar />
      {children}
    </SnackbarProvider>
  );
}
