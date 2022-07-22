import { Box, DialogContentText, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import PaperTextBox from '../../PaperTextBox';
import { useActiveDbState, useAppSelector } from '../../../../../store/hooks';

export default function DebugPage() {
  const swapStdOut = useAppSelector((s) => s.swap.stdOut);
  const torStdOut = useAppSelector((s) => s.tor.stdOut);
  const fullSwapStateString = useAppSelector((s) =>
    JSON.stringify(s.swap, null, '\t')
  );
  const dbStateString = JSON.stringify(useActiveDbState(), null, '\t');
  const relevantTransactions = useAppSelector((s) =>
    JSON.stringify(
      s.electrum.filter((tx) => tx.transaction.swapId === s.swap.swapId),
      null,
      '\t'
    )
  );

  return (
    <Box>
      <DialogContentText>
        <Alert severity="warning">
          This page contains confidential information including private keys.
          Keep this information to yourself. Otherwise you will lose your money!
        </Alert>
        <br />
        <Typography>Swap standard output</Typography>
        <PaperTextBox stdOut={swapStdOut} />
        <Typography>Swap state</Typography>
        <PaperTextBox stdOut={fullSwapStateString} />
        <Typography>Database state</Typography>
        <PaperTextBox stdOut={dbStateString} />
        <Typography>Blockchain transactions</Typography>
        <PaperTextBox stdOut={relevantTransactions} />
        <Typography>Tor standard output</Typography>
        <PaperTextBox stdOut={torStdOut} />
      </DialogContentText>
    </Box>
  );
}
