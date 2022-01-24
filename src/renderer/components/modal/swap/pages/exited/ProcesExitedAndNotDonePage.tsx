import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateProcessExited } from '../../../../../../models/storeModel';
import { MergedDbState } from '../../../../../../models/databaseModel';
import { useAppSelector } from '../../../../../../store/hooks';
import LogsBox from '../../../LogsBox';

type Props = {
  state: SwapStateProcessExited;
  dbState: MergedDbState | null;
};

export default function ProcesExitedAndNotDonePage({ state, dbState }: Props) {
  const stdOut = useAppSelector((s) => s.swap.stdOut);

  return (
    <Box>
      <DialogContentText>
        The swap-cli process has exited
        {state.exitCode != null
          ? ` with the exit code ${state.exitCode}`
          : ''}{' '}
        but the swap has not been completed yet.{' '}
        {dbState ? `The current state is ${dbState.type}.` : null} Please check
        the logs displayed below for more information. You might have to
        manually take some action.
        <LogsBox stdOut={stdOut} />
      </DialogContentText>
    </Box>
  );
}
