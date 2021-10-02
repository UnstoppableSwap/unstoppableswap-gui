import { Box, Button, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { resetSwap } from 'store/features/swap/swapSlice';
import { SwapStateProcessExited } from '../../../../../../models/store';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';

const useStyles = makeStyles((theme) => ({
  leftButton: {
    marginRight: theme.spacing(1),
  },
  logsOuter: {
    overflow: 'auto',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
}));

type ProcessExitedPageProps = {
  state: SwapStateProcessExited;
};

export default function ProcessExitedPage({ state }: ProcessExitedPageProps) {
  const classes = useStyles();
  const processRunning = useAppSelector((s) => s.swap.processRunning);
  const logs = useAppSelector((s) => s.swap.logs);
  const dispatch = useAppDispatch();

  function close() {
    if (!processRunning) {
      dispatch(resetSwap());
    }
  }

  function toggleLogs() {}

  return (
    <Box>
      <Typography variant="h5" align="center">
        Swap process exited
      </Typography>
      {state.exitCode != null ? (
        <Typography variant="body1">Exit code: {state.exitCode}</Typography>
      ) : null}
      <Box>
        <Button
          variant="text"
          onClick={toggleLogs}
          className={classes.leftButton}
        >
          Show logs
        </Button>
        <Button variant="contained" onClick={close} color="primary">
          Close
        </Button>
        <Paper className={classes.logsOuter}>
          {logs.map((log) => (
            <Typography variant="body2" key={JSON.stringify(log)}>
              {JSON.stringify(log)}
            </Typography>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}
