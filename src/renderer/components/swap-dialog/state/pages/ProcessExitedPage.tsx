import { Box, Button, Typography } from '@material-ui/core';
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
    <Box>
      <Typography variant="h5" align="center">
        Swap exited
      </Typography>
      {state.exitCode != null ? (
        <Typography variant="body1">Exit code: {state.exitCode}</Typography>
      ) : null}
      <Box>
        <Button variant="text" onClick={onClose}>
          Show logs
        </Button>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
}
