import { Box, DialogContentText } from '@material-ui/core';
import {
  useActiveSwapInfo,
  useAppSelector,
} from '../../../../../../store/hooks';
import CliLogsBox from '../../../../other/RenderedCliLog';

export default function ProcesExitedAndNotDonePage() {
  const swap = useActiveSwapInfo();
  const logs = useAppSelector((s) => s.swap.logs);

  const text = swap ? (
    <>
      The swap exited unexpectedly without completing. The current state is
      &quot;{swap.stateName}&quot;. You might have to manually take some action.
    </>
  ) : (
    <>
      The swap exited unexpectedly before being initiated and without
      completing.
    </>
  );

  return (
    <Box>
      <DialogContentText>
        {text} Please check the logs displayed below for more information.
      </DialogContentText>
      <CliLogsBox logs={logs} label="Logs relevant to the swap" />
    </Box>
  );
}
