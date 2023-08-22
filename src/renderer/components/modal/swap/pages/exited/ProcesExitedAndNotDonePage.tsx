import { Box, DialogContentText } from '@material-ui/core';
import {
  useActiveSwapInfo,
  useAppSelector,
} from '../../../../../../store/hooks';
import PaperTextBox from '../../../PaperTextBox';
import { logsToRawString } from '../../../../../../utils/parseUtils';

export default function ProcesExitedAndNotDonePage() {
  const swap = useActiveSwapInfo();
  const swapStdOut = useAppSelector((s) => logsToRawString(s.swap.logs));

  if (!swap) {
    return null;
  }

  return (
    <Box>
      <DialogContentText>
        The swap-cli process has exited but the swap has not been completed yet.{' '}
        The current state is "{swap.state.type}". Please check the logs
        displayed below for more information. You might have to manually take
        some action.
      </DialogContentText>
      <PaperTextBox stdOut={swapStdOut} />
    </Box>
  );
}
