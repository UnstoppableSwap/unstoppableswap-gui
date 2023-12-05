import { Box, DialogContentText } from '@material-ui/core';
import {
  useActiveSwapInfo,
  useAppSelector,
} from '../../../../../../store/hooks';
import CliLogsBox from '../../../../other/RenderedCliLog';
import { SwapStateProcessExited } from '../../../../../../models/storeModel';

export default function ProcessExitedAndNotDonePage({
  state,
}: {
  state: SwapStateProcessExited;
}) {
  const swap = useActiveSwapInfo();
  const logs = useAppSelector((s) => s.swap.logs);

  const text = swap ? (
    <>
      The swap exited unexpectedly without completing. The current state is
      &quot;{swap.stateName}&quot;. You might have to manually take some action.
    </>
  ) : (
    <>
      The swap exited unexpectedly before any funds were locked and without
      completing.
    </>
  );

  return (
    <Box>
      <DialogContentText>
        {text} Please check the logs displayed below for more information.
      </DialogContentText>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <CliLogsBox logs={logs} label="Logs relevant to the swap" />
        {state.rpcError && (
          <CliLogsBox
            logs={[state.rpcError]}
            label="Error returned by the Swap Daemon"
          />
        )}
      </Box>
    </Box>
  );
}
