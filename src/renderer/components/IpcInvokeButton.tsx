import {
  Button,
  ButtonProps,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useAppSelector } from '../../store/hooks';
import { RpcProcessStateType } from '../../models/rpcModel';

interface IpcInvokeButtonProps {
  ipcArgs: unknown[];
  ipcChannel: string;
  // eslint-disable-next-line react/require-default-props
  onSuccess?: (data: unknown) => void;
  isLoadingOverride?: boolean;
  isIconButton?: boolean;
  loadIcon?: React.ReactNode;
  requiresRpc?: boolean;
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
  requiresRpc,
  ...rest
}: IpcInvokeButtonProps & ButtonProps) {
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
      } catch (e: any) {
        enqueueSnackbar(e.message, {
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
      disabled={isLoading || (requiresRpc && !isRpcReady)}
      endIcon={actualEndIcon}
      {...rest}
    />
  );
}
