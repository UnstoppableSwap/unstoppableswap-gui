import { Box, makeStyles } from '@material-ui/core';
import ContactInfoBox from './ContactInfoBox';
import FeedbackInfoBox from './FeedbackInfoBox';
import DonateInfoBox from './DonateInfoBox';
import TorInfoBox from './TorInfoBox';
import MonitoredTransactionBox from './MonitoredTransactionsBox';

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'flex',
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
}));

export default function HelpPage() {
  const classes = useStyles();

  return (
    <Box className={classes.outer}>
      <TorInfoBox />
      <FeedbackInfoBox />
      <ContactInfoBox />
      <DonateInfoBox />
      <MonitoredTransactionBox />
    </Box>
  );
}
