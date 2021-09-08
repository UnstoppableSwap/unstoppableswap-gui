import React, { useState } from 'react';
import { Button, DialogActions, DialogContent } from '@material-ui/core';
import SwapDialogTitle from '../SwapDialogTitle';
import useStore from '../../../store';
import SwapStopAlert from './SwapStopAlert';
import { SwapState } from '../../../../swap/swap-state-machine';

export default function SwapStatePage() {
  const swapState = useStore((state) => state.swapState) as SwapState;
  const [openCancelAlert, setOpenCancelAlert] = useState(false);

  return (
    <>
      <SwapDialogTitle title="Running swap" />

      <DialogContent dividers>
        <pre>{JSON.stringify(swapState, null, '\t')}</pre>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenCancelAlert(true)} variant="text">
          Cancel
        </Button>
      </DialogActions>

      <SwapStopAlert
        open={openCancelAlert}
        onClose={() => setOpenCancelAlert(false)}
      />
    </>
  );
}
