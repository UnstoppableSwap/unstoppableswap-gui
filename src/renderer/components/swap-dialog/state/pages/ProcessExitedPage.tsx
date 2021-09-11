import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateProcessExited } from '../../../../../swap/swap-state-machine';
import useStore from '../../../../store';

type ProcessExitedPageProps = {
  state: SwapStateProcessExited;
};

export default function ProcessExitedPage({ state }: ProcessExitedPageProps) {
  const setSwapState = useStore((s) => s.setSwapState);

  function onClose() {
    if (!state.running) {
      setSwapState(null);
    }
  }

  return (
    <>
      <Typography variant="h5">Swap process exited</Typography>
      {state.exitCode != null ? (
        <Typography variant="body1">Exit code: {state.exitCode}</Typography>
      ) : null}
      <Button variant="contained" onClick={onClose}>
        Close
      </Button>
    </>
  );
}
