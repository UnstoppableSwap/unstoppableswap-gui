import {
  Button,
  ButtonProps,
  CircularProgress,
  Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';

interface IpcInvokeButtonProps {
  ipcArgs: unknown[];
  ipcChannel: string;
  // eslint-disable-next-line react/require-default-props
  onSuccess?: () => void;
}

export default function IpcInvokeButton({
  ipcChannel,
  ipcArgs,
  onSuccess,
  onClick,
  endIcon,
  ...rest
}: IpcInvokeButtonProps & ButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [hasMinLoadingTimePassed, setHasMinLoadingTimePassed] = useState(false);
  const [err, setErr] = useState<any | null>(null);

  const actualEndIcon =
    isPending && hasMinLoadingTimePassed ? (
      <CircularProgress size="1rem" />
    ) : (
      endIcon
    );

  useEffect(() => {
    setHasMinLoadingTimePassed(false);
    setTimeout(() => setHasMinLoadingTimePassed(true), 300);
  }, [isPending]);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (!isPending) {
      setIsPending(true);
      try {
        await ipcRenderer.invoke(ipcChannel, ...ipcArgs);
        onSuccess?.();
      } catch (e) {
        setErr(e);
      } finally {
        setIsPending(false);
      }
    }
  }

  return (
    <>
      <Button onClick={handleClick} endIcon={actualEndIcon} {...rest} />
      <Snackbar
        open={!!err}
        autoHideDuration={6000}
        onClose={() => setErr(null)}
      >
        <Alert onClose={() => setErr(null)} severity="error">
          Failed to invoke {ipcChannel}: {err?.toString()}
        </Alert>
      </Snackbar>
    </>
  );
}
