import { Box, DialogContentText } from '@material-ui/core';

export default function BitcoinPunishedPage() {
  return (
    <Box>
      <DialogContentText>
        Unfortunately the swap was not successful and you have been punished for
        not refunding in time. It is impossible to recover your Bitcoin or your
        Monero. You may exit the application now.
      </DialogContentText>
    </Box>
  );
}
