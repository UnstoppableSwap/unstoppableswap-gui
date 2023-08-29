import { Box, makeStyles } from '@material-ui/core';
import ContactInfoBox from './ContactInfoBox';
import FeedbackInfoBox from './FeedbackInfoBox';
import DonateInfoBox from './DonateInfoBox';
import TorInfoBox from './TorInfoBox';
import RpcControlBox from './RpcControlBox';

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
      <RpcControlBox />
      <TorInfoBox />
      <FeedbackInfoBox />
      <ContactInfoBox />
      <DonateInfoBox />
    </Box>
  );
}
