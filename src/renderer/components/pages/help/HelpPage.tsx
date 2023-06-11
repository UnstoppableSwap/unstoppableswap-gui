import { Box, makeStyles } from '@material-ui/core';
import ContactInfoBox from './ContactInfoBox';
import FeedbackInfoBox from './FeedbackInfoBox';
import DonateInfoBox from './DonateInfoBox';
import TorInfoBox from './TorInfoBox';
import ElectrumInfoBox from './ElectrumInfoBox';

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'flex',
    gap: theme.spacing(2),
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
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
      <ElectrumInfoBox />
    </Box>
  );
}
