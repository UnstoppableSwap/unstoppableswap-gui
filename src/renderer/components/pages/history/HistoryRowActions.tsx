import { Button } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { ButtonProps } from '@material-ui/core/Button/Button';
import {
  MergedDbState,
  isSwapResumable,
} from '../../../../models/databaseModel';

export function SwapResumeButton({
  dbState,
  ...props
}: { dbState: MergedDbState } & ButtonProps) {
  const resumable = isSwapResumable(dbState);

  async function resume() {
    await ipcRenderer.invoke('resume-buy-xmr', dbState.swapId);
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={resume}
      disabled={!resumable}
      {...props}
    >
      Resume
    </Button>
  );
}

export default function HistoryRowActions({
  dbState,
}: {
  dbState: MergedDbState;
}) {
  return <SwapResumeButton dbState={dbState} />;
}
