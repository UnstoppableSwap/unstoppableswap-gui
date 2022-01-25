import { Button, DialogActions, DialogContent } from '@material-ui/core';
import CircularProgressWithSubtitle from '../../swap/CircularProgressWithSubtitle';
import WithdrawStepper from '../WithdrawStepper';

export default function InitiatedPage({ onCancel }: { onCancel: () => void }) {
  return (
    <>
      <DialogContent dividers>
        <CircularProgressWithSubtitle description="Withdrawing Bitcoin" />
        <WithdrawStepper />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
        <Button disabled color="primary" variant="contained">
          Done
        </Button>
      </DialogActions>
    </>
  );
}
