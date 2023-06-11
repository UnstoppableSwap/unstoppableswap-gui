import { Box, DialogContentText, Typography } from '@material-ui/core';
import PaperTextBox from '../../PaperTextBox';
import { useActiveDbState, useAppSelector } from '../../../../../store/hooks';
import ConfidentialityAlert from '../../../alert/ConfidentialityAlert';

export default function DebugPage() {
  const swapStdOut = useAppSelector((s) => s.swap.stdOut);
  const torStdOut = useAppSelector((s) => s.tor.stdOut);
  const fullSwapStateString = useAppSelector((s) =>
    JSON.stringify(s.swap, null, '\t')
  );
  const dbStateString = JSON.stringify(useActiveDbState(), null, '\t');
  const relevantTransactions = useAppSelector((s) =>
    JSON.stringify(
      s.electrum.txs.filter((tx) => tx.transaction.swapId === s.swap.swapId),
      null,
      '\t'
    )
  );

  return (
    <Box>
      <DialogContentText>
        <ConfidentialityAlert />
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
