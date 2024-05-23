import { Box, makeStyles } from '@material-ui/core';
import SwapWidget from './SwapWidget';
import ApiAlertsBox from './ApiAlertsBox';

const useStyles = makeStyles({
  outer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
});

export default function SwapPage() {
  const classes = useStyles();

  return (
    <Box className={classes.outer}>
      <ApiAlertsBox />
      <SwapWidget />
    </Box>
  );
}
