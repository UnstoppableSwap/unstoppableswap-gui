import { Box, makeStyles } from '@material-ui/core';
import { useAppSelector } from '../../../store/hooks';
import { isSwapResumable } from '../../../models/databaseModel';
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
  const resumeableSwaps = useAppSelector((state) =>
    Object.values(state.rpc.state.swapInfos).filter(isSwapResumable)
  );

  return (
    <Box className={classes.outer}>
      {resumeableSwaps.map((swap) => (
        <SwapTxLockStatusAlert key={swap.swapId} swap={swap} />
      ))}
    </Box>
  );
}
