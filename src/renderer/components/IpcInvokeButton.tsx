import {
  Button,
  ButtonProps,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { ReactNode, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useAppSelector } from '../../store/hooks';
import { RpcProcessStateType } from '../../models/rpcModel';

interface IpcInvokeButtonProps<T> {
  ipcArgs: unknown[];
  ipcChannel: string;
  onSuccess?: (data: T) => void;
  isLoadingOverride?: boolean;
  isIconButton?: boolean;
  loadIcon?: ReactNode;
  requiresRpc?: boolean;
  disabled?: boolean;
  displayErrorSnackbar?: boolean;
}

const DELAY_BEFORE_SHOWING_LOADING_MS = 0;

export default function IpcInvokeButton<T>({
  disabled,
  ipcChannel,
  ipcArgs,
  onSuccess,
  onClick,
  endIcon,
  loadIcon,
  isLoadingOverride,
  isIconButton,
  requiresRpc,
  displayErrorSnackbar,
  ...rest
}: IpcInvokeButtonProps<T> & ButtonProps) {
  const { enqueueSnackbar } = useSnackbar();

  const isRpcReady = useAppSelector(
    (state) =>
      state.rpc.process.type === RpcProcessStateType.LISTENING_FOR_CONNECTIONS
  );
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
        const result = await ipcRenderer.invoke(ipcChannel, ...ipcArgs);
        onSuccess?.(result);
      } catch (e: unknown) {
        if (displayErrorSnackbar) {
          enqueueSnackbar((e as Error).message, {
            autoHideDuration: 60 * 1000,
            variant: 'error',
          });
        }
      } finally {
        setIsPending(false);
      }
    }
  }

  const isDisabled =
    disabled ||
    (requiresRpc && !isRpcReady && process.env.USE_EXTERNAL_RPC !== 'true') ||
    isLoading;

  if (isIconButton) {
    return (
      <IconButton
        onClick={handleClick}
        disabled={isDisabled}
        {...(rest as any)}
      >
        {actualEndIcon}
      </IconButton>
    );
  }
  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      endIcon={actualEndIcon}
      {...rest}
    />
  );
}

IpcInvokeButton.defaultProps = {
  requiresRpc: true,
  disabled: false,
  onSuccess: undefined,
  isLoadingOverride: false,
  isIconButton: false,
  loadIcon: undefined,
  displayErrorSnackbar: true,
};
