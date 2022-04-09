import { Box, DialogContentText, Typography } from '@material-ui/core';
import PaperTextBox from '../../PaperTextBox';
import { useActiveDbState, useAppSelector } from '../../../../../store/hooks';

export default function DebugPage() {
  const stdOut = useAppSelector((s) => s.swap.stdOut);
  const fullSwapStateString = useAppSelector((s) =>
    JSON.stringify(s.swap, null, '\t')
  );
  const dbStateString = JSON.stringify(useActiveDbState(), null, '\t');

  return (
    <Box>
      <DialogContentText>
        <Typography>Logs</Typography>
        <PaperTextBox stdOut={stdOut} />
        <Typography>Swap state</Typography>
        <PaperTextBox stdOut={fullSwapStateString} />
        <Typography>Database state</Typography>
        <PaperTextBox stdOut={dbStateString} />
      </DialogContentText>
    </Box>
  );
}
