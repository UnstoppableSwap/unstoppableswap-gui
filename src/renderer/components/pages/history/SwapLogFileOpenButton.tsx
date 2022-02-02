import { ButtonProps } from '@material-ui/core/Button/Button';
import { Button } from '@material-ui/core';
import { ipcRenderer, shell } from 'electron';
import { useState } from 'react';

export default function SwapLogFileOpenButton({
  swapId,
  ...props
}: { swapId: string } & ButtonProps) {
  const [blocked, setBlocked] = useState(false);

  async function openLogFile() {
    if (blocked) return;
    setBlocked(true);
    const file = await ipcRenderer.invoke('get-cli-log-path', swapId);
    await shell.openPath(file);
    setBlocked(false);
  }

  return (
    <Button onClick={openLogFile} {...props}>
      view log
    </Button>
  );
}
