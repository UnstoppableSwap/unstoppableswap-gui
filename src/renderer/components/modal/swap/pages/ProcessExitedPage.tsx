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
  isMergedDoneXmrRedeemedDbState,
  MergedDbState,
} from 'models/databaseModel';
import {
  isSwapStateBtcRefunded,
  isSwapStateXmrRedeemInMempool,
  SwapStateProcessExited,
} from '../../../../../models/storeModel';
import { useActiveDbState, useAppSelector } from '../../../../../store/hooks';
import XmrRedeemInMempoolPage from './done/XmrRedeemInMempoolPage';
import BitcoinPunishedPage from './done/BitcoinPunishedPage';
// eslint-disable-next-line import/no-cycle
import SwapStatePage from '../SwapStatePage';
import BitcoinRefundedPage from './done/BitcoinRefundedPage';

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

  if (
    isSwapStateXmrRedeemInMempool(state.prevState) ||
    isSwapStateBtcRefunded(state.prevState)
  ) {
    return <SwapStatePage swapState={state.prevState} />;
  }

  if (dbState) {
    if (isMergedDoneXmrRedeemedDbState(dbState)) {
      return <XmrRedeemInMempoolPage state={null} />;
    }
    if (isMergedDoneBtcRefundedDbState(dbState)) {
      return <BitcoinRefundedPage state={null} />;
    }
    if (isMergedDoneBtcPunishedDbState(dbState)) {
      return <BitcoinPunishedPage />;
    }
  }

  return <DbStateNotDone state={state} dbState={dbState} />;
}
