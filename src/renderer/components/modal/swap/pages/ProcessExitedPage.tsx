import {
  Box,
  DialogContentText,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    maxHeight: '10rem',
  },
}));

type ProcessExitedPageProps = {
  state: SwapStateProcessExited;
};

export default function ProcessExitedPage({ state }: ProcessExitedPageProps) {
  const classes = useStyles();
  const stdOut = useAppSelector((s) => s.swap.stdOut);

  return (
    <Box>
      <DialogContentText>
        The swap-cli process has exited
        {state.exitCode != null ? ` with the exit code ${state.exitCode}` : ''}.
        Please check the logs displayed below for more information.
      </DialogContentText>
      <Paper className={classes.logsOuter} variant="outlined">
        <Typography component="pre" variant="body2">
          {stdOut}
        </Typography>
      </Paper>
    </Box>
  );
}
