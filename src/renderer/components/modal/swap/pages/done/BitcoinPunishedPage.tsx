import { Box, DialogContentText } from '@material-ui/core';
import FeedbackInfoBox from '../../../../pages/help/FeedbackInfoBox';

export default function BitcoinPunishedPage() {
  return (
    <Box>
      <DialogContentText>
        Unfortunately, the swap was not successful, and you&apos;ve incurred a
        penalty for failing to refund in time. Both the Bitcoin and Monero are
        irretrievable. The swap process is now complete, and you may exit the
        application.
      </DialogContentText>
      <FeedbackInfoBox />
    </Box>
  );
}
