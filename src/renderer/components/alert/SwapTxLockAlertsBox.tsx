import { Box, makeStyles } from '@material-ui/core';
import { useAppSelector } from '../../../store/hooks';
import SwapTxLockStatusAlert from './SwapTxLockStatusAlert';
import { SwapStateName } from '../../../models/rpcModel';

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export default function SwapTxLockAlertsBox() {
  const classes = useStyles();

  // We only want to show the alerts when the swap is not completed and the Bitcoin have been locked (such that there is a risk of losing funds)
  const resumeableSwaps = useAppSelector((state) =>
    Object.values(state.rpc.state.swapInfos).filter(
      (swap) =>
        !swap.completed && swap.stateName !== SwapStateName.SwapSetupCompleted
    )
  );

  return (
    <Box className={classes.outer}>
      {resumeableSwaps.map((swap) => (
        <SwapTxLockStatusAlert key={swap.swapId} swap={swap} />
      ))}
    </Box>
  );
}
