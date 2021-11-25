import { Button } from '@material-ui/core';
import React from 'react';
import { ipcRenderer } from 'electron';
import {
  isMergedBtcLockedDbState,
  isMergedBtcRedeemedDbState,
  isMergedEncSigSentDbState,
  isMergedExecutionSetupDoneDbState,
  isMergedXmrLockedDbState,
  isMergedXmrLockProofReceivedDbState,
  MergedDbState,
} from '../../../../models/databaseModel';

export default function HistoryRowActions({
  dbState,
}: {
  dbState: MergedDbState;
}) {
  async function resume() {
    await ipcRenderer.invoke('resume-buy-xmr', dbState.swapId);
  }

  if (
    isMergedExecutionSetupDoneDbState(dbState) ||
    isMergedBtcLockedDbState(dbState) ||
    isMergedXmrLockProofReceivedDbState(dbState) ||
    isMergedXmrLockedDbState(dbState) ||
    isMergedEncSigSentDbState(dbState) ||
    isMergedBtcRedeemedDbState(dbState)
  ) {
    return (
      <Button variant="contained" color="primary" onClick={resume}>
        Resume
      </Button>
    );
  }
  return null;
}
