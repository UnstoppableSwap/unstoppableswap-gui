import {
  Box,
  DialogContentText,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { SwapStateProcessExited } from '../../../../../../models/storeModel';
import { MergedDbState } from '../../../../../../models/databaseModel';
import { useAppSelector } from '../../../../../../store/hooks';

const useStyles = makeStyles((theme) => ({
  leftButton: {
    marginRight: theme.spacing(1),
  },
  logsOuter: {
    overflow: 'auto',
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

type Props = {
  state: SwapStateProcessExited;
  dbState: MergedDbState | null;
};

export default function ProcesExitedAndNotDonePage({ state, dbState }: Props) {
  const classes = useStyles();
  const stdOut = useAppSelector((s) => s.swap.stdOut);

  return (
    <Box>
      <DialogContentText>
        The swap-cli process has exited
        {state.exitCode != null
          ? ` with the exit code ${state.exitCode}`
          : ''}{' '}
        but the swap has not been completed yet.{' '}
        {dbState ? `The current state is ${dbState.type}.` : null} Please check
        the logs displayed below for more information. You might have to
        manually take some action.
      </DialogContentText>
      <Paper className={classes.logsOuter} variant="outlined">
        <Typography component="pre" variant="body2">
          {stdOut}
        </Typography>
      </Paper>
    </Box>
  );
}
