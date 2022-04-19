import { Box, makeStyles } from '@material-ui/core';
import { useAppSelector } from '../../../../../store/hooks';
import { isSwapResumable } from '../../../../../models/databaseModel';
import SwapTxLockStatusAlert from './SwapTxLockStatusAlert';

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export default function SwapTxLockAlertsBox() {
  const classes = useStyles();
  const resumeableDbStates = useAppSelector((state) =>
    state.history.filter(isSwapResumable)
  );

  return (
    <Box className={classes.outer}>
      {resumeableDbStates.map((dbState) => (
        <SwapTxLockStatusAlert key={dbState.swapId} dbState={dbState} />
      ))}
    </Box>
  );
}
