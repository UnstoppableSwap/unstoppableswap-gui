import { Box, makeStyles } from '@material-ui/core';
import SwapWidget from './SwapWidget';
import ApiAlertsBox from './ApiAlertsBox';

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
    gap: theme.spacing(1),
  },
}));

export default function SwapPage() {
  const classes = useStyles();

  return (
    <Box className={classes.outer}>
      <ApiAlertsBox />
      <SwapWidget />
    </Box>
  );
}
