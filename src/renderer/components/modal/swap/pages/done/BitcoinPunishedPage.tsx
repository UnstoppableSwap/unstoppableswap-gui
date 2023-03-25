import { Box, DialogContentText } from '@material-ui/core';
import FeedbackInfoBox from '../../../../pages/help/FeedbackInfoBox';

export default function BitcoinPunishedPage() {
  return (
    <Box>
      <DialogContentText>
        Unfortunately the swap was unsuccessful and you have been punished for
        not refunding in time. It&#39;s impossible to recover the Bitcoin or the
        Monero. The swap is completed and you may exit the application now.
      </DialogContentText>
      <FeedbackInfoBox />
    </Box>
  );
}
