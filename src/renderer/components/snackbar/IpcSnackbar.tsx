import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { ipcRenderer } from 'electron';

export default function IpcSnackbar() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    function onIpcMessage(
      _: any,
      message: string,
      variant: any,
      autoHideDuration: number | null,
      key: string | null,
    ) {
      enqueueSnackbar(message, {
        variant,
        autoHideDuration,
        key,
        preventDuplicate: true,
      });
    }

    ipcRenderer.on('display-snackbar-alert', onIpcMessage);

    return () => {
      ipcRenderer.removeListener('display-snackbar-alert', onIpcMessage);
    };
  }, [enqueueSnackbar]);

  return <></>;
}
