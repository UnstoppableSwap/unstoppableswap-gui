import { Box, Button, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateProcessExited } from '../../../../../models/storeModel';
import { useAppSelector } from '../../../../../store/hooks';

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
  onCancel: () => void;
};

export default function ProcessExitedPage({
  state,
  onCancel,
}: ProcessExitedPageProps) {
  const classes = useStyles();
  const stdOut = useAppSelector((s) => s.swap.stdOut);

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
        <Button variant="contained" onClick={onCancel} color="primary">
          Close
        </Button>
        <Paper className={classes.logsOuter}>
          <pre>{stdOut}</pre>
        </Paper>
      </Box>
    </Box>
  );
}
