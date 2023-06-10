import {
  Button,
  ButtonProps,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

interface IpcInvokeButtonProps {
  ipcArgs: unknown[];
  ipcChannel: string;
  // eslint-disable-next-line react/require-default-props
  onSuccess?: () => void;
  isLoadingOverride?: boolean;
  isIconButton?: boolean;
  loadIcon?: React.ReactNode;
}

const DELAY_BEFORE_SHOWING_LOADING_MS = 1000;

export default function IpcInvokeButton({
  ipcChannel,
  ipcArgs,
  onSuccess,
  onClick,
  endIcon,
  loadIcon,
  isLoadingOverride,
  isIconButton,
  ...rest
}: IpcInvokeButtonProps & ButtonProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [isPending, setIsPending] = useState(false);
  const [hasMinLoadingTimePassed, setHasMinLoadingTimePassed] = useState(false);

  const isLoading = (isPending && hasMinLoadingTimePassed) || isLoadingOverride;
  const actualEndIcon = isLoading
    ? loadIcon || <CircularProgress size="1rem" />
    : endIcon;

  useEffect(() => {
    setHasMinLoadingTimePassed(false);
    setTimeout(
      () => setHasMinLoadingTimePassed(true),
      DELAY_BEFORE_SHOWING_LOADING_MS
    );
  }, [isPending]);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (!isPending) {
      setIsPending(true);
      try {
        await ipcRenderer.invoke(ipcChannel, ...ipcArgs);
        onSuccess?.();
      } catch (e: any) {
        const message = `Failed to invoke ${ipcChannel}: ${e.message}`;
        enqueueSnackbar(message, {
          autoHideDuration: 60 * 1000,
          variant: 'error',
        });
      } finally {
        setIsPending(false);
      }
    }
  }

  if (isIconButton) {
    return (
      <IconButton onClick={handleClick} disabled={isLoading} {...(rest as any)}>
        {actualEndIcon}
      </IconButton>
    );
  }
  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      endIcon={actualEndIcon}
      {...rest}
    />
  );
}
