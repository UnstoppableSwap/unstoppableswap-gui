import { Dialog } from '@material-ui/core';
import React, { useState } from 'react';
import { withdrawReset } from 'store/features/withdrawSlice';
import DialogHeader from '../DialogHeader';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import AddressInputPage from './pages/AddressInputPage';
import RunningPage from './pages/RunningPage';
import CliStopAlert from '../CliStopAlert';
import { isWithdrawState } from '../../../../models/storeModel';

function InnerContent({ onCancel }: { onCancel: () => void }) {
  const isRunning = useAppSelector((state) =>
    isWithdrawState(state.withdraw.state)
  );

  if (isRunning) {
    return <RunningPage onCancel={onCancel} />;
  }
  return <AddressInputPage onCancel={onCancel} />;
}

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

  function onCancel() {
    if (processRunning) {
      setOpenCancelAlert(true);
    } else {
      onClose();
      setImmediate(() => dispatch(withdrawReset()));
    }
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogHeader title="Withdraw Bitcoin" />
      <InnerContent onCancel={onCancel} />
      <CliStopAlert
        open={openCancelAlert}
        onClose={() => setOpenCancelAlert(false)}
      />
    </Dialog>
  );
}
