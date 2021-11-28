import { Button } from '@material-ui/core';
import React from 'react';
import { ipcRenderer } from 'electron';
import { ButtonProps } from '@material-ui/core/Button/Button';
import { MergedDbState } from '../../../../models/databaseModel';
import {
  isSwapRefundable,
  isSwapResumable,
} from '../../../../utils/parseUtils';

export function SwapResumeButton({
  dbState,
  ...props
}: { dbState: MergedDbState } & ButtonProps) {
  const resumable = isSwapResumable(dbState);

  async function resume() {
    await ipcRenderer.invoke('resume-buy-xmr', dbState.swapId);
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={resume}
      disabled={!resumable}
      {...props}
    >
      Resume
    </Button>
  );
}

export function SwapCancelRefundButton({
  dbState,
  ...props
}: {
  dbState: MergedDbState;
} & ButtonProps) {
  const cancelable = isSwapResumable(dbState);
  const refundable = isSwapRefundable(dbState);

  async function cancelOrRefund() {
    if (cancelable) {
      await ipcRenderer.invoke('cancel-buy-xmr', dbState.swapId);
    } else if (refundable) {
      await ipcRenderer.invoke('refund-buy-xmr', dbState.swapId);
    }
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={cancelOrRefund}
      disabled={!cancelable && !refundable}
      {...props}
    >
      Cancel & Refund
    </Button>
  );
}

export default function HistoryRowActions({
  dbState,
}: {
  dbState: MergedDbState;
}) {
  return <SwapResumeButton dbState={dbState} />;
}
