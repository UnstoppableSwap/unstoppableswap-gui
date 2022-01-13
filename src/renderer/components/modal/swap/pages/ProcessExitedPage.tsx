import {
  Box,
  DialogContentText,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  isMergedDoneBtcPunishedDbState,
  isMergedDoneBtcRefundedDbState,
  MergedDbState,
} from 'models/databaseModel';
import {
  isSwapStateXmrRedeemInMempool,
  SwapStateProcessExited,
} from '../../../../../models/storeModel';
import { useActiveDbState, useAppSelector } from '../../../../../store/hooks';
import XmrRedeemInMempoolPage from './XmrRedeemInMempoolPage';

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

function DbStatePunished() {
  return (
    <Box>
      <DialogContentText>
        You have been punished for not refunding in time. It is not possible to
        recover the Monero or the Bitcoin.
      </DialogContentText>
    </Box>
  );
}

function DbStateRefunded() {
  return (
    <Box>
      <DialogContentText>
        The swap has been cancelled and your Bitcoin have been refunded.
      </DialogContentText>
    </Box>
  );
}

function DbStateNotDone({
  state,
  dbState,
}: {
  state: SwapStateProcessExited;
  dbState: MergedDbState | undefined;
}) {
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

export default function ProcessExitedPage({ state }: ProcessExitedPageProps) {
  const dbState = useActiveDbState();

  if (dbState) {
    if (isMergedDoneBtcPunishedDbState(dbState)) {
      return <DbStatePunished />;
    }
    if (isMergedDoneBtcRefundedDbState(dbState)) {
      return <DbStateRefunded />;
    }
  }
  if (isSwapStateXmrRedeemInMempool(state.prevState)) {
    return <XmrRedeemInMempoolPage state={state.prevState} />;
  }

  return <DbStateNotDone state={state} dbState={dbState} />;
}
