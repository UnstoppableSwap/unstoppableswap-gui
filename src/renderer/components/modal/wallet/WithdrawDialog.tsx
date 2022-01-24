import { Dialog } from '@material-ui/core';
import { useState } from 'react';
import { withdrawReset } from 'store/features/withdrawSlice';
import DialogHeader from '../DialogHeader';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import CliStopAlert from '../CliStopAlert';
import WithdrawStatePage from './WithdrawStatePage';

export default function WithdrawDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const processRunning = useAppSelector(
    (state) => state.withdraw.processRunning
  );
  const [openCancelAlert, setOpenCancelAlert] = useState(false);
  const dispatch = useAppDispatch();
  const withdrawState = useAppSelector((state) => state.withdraw.state);

  function onCancel() {
    if (processRunning) {
      setOpenCancelAlert(true);
    } else {
      onClose();
      dispatch(withdrawReset());
    }
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogHeader title="Withdraw Bitcoin" />
      <WithdrawStatePage onCancel={onCancel} state={withdrawState} />
      <CliStopAlert
        open={openCancelAlert}
        onClose={() => setOpenCancelAlert(false)}
      />
    </Dialog>
  );
}
