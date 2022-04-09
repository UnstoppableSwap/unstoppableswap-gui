import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import { useAppSelector } from '../../../../../store/hooks';
import WithdrawStepper from '../WithdrawStepper';
import PaperTextBox from '../../PaperTextBox';
import { WithdrawStateProcessExited } from '../../../../../models/storeModel';

export default function ProcessExitedNotDone({
  onCancel,
  state,
}: {
  onCancel: () => void;
  state: WithdrawStateProcessExited;
}) {
  const stdOut = useAppSelector((s) => s.withdraw.stdOut);

  return (
    <>
      <DialogContent dividers>
        <DialogContentText>
          The swap-cli process has exited
          {state.exitCode != null
            ? ` with the exit code ${state.exitCode}`
            : ''}{' '}
          but the funds have not been withdrawn yet. Please check the logs
          displayed below for more information.
        </DialogContentText>
        <PaperTextBox stdOut={stdOut} />
        <WithdrawStepper />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
        <Button onClick={onCancel} color="primary" variant="contained">
          Done
        </Button>
      </DialogActions>
    </>
  );
}
