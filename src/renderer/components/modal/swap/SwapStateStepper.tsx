import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import {
  isMergedBtcLockedDbState,
  isMergedBtcRedeemedDbState,
  isMergedCancelTimelockExpiredDbState,
  isMergedDoneBtcPunishedDbState,
  isMergedDoneBtcRefundedDbState,
  isMergedDoneXmrRedeemedDbState,
  isMergedEncSigSentDbState,
  isMergedExecutionSetupDoneDbState,
  isMergedXmrLockedDbState,
  isMergedXmrLockProofReceivedDbState,
  MergedDbState,
} from 'models/databaseModel';
import { useActiveDbState, useAppSelector } from '../../../../store/hooks';

function getActiveStep(
  dbState: MergedDbState | undefined,
  processExited: boolean
): [number, boolean] {
  if (dbState) {
    if (isMergedExecutionSetupDoneDbState(dbState)) {
      return [0, processExited];
    }
    if (isMergedBtcLockedDbState(dbState)) {
      return [0, processExited];
    }
    if (isMergedXmrLockProofReceivedDbState(dbState)) {
      return [1, processExited];
    }
    if (isMergedXmrLockedDbState(dbState)) {
      return [2, processExited];
    }
    if (isMergedEncSigSentDbState(dbState)) {
      return [2, processExited];
    }
    if (isMergedBtcRedeemedDbState(dbState)) {
      return [3, processExited];
    }
    if (isMergedDoneXmrRedeemedDbState(dbState)) {
      return [4, false];
    }

    // TODO: displays punish and refund as "Redeeming your XMR"
    if (isMergedDoneBtcRefundedDbState(dbState)) {
      return [4, true];
    }
    if (isMergedDoneBtcPunishedDbState(dbState)) {
      return [4, true];
    }
    if (isMergedCancelTimelockExpiredDbState(dbState)) {
      return [4, true];
    }
  }
  return [0, false];
}

export default function SwapStateStepper() {
  const dbState = useActiveDbState();
  const processExited = useAppSelector((s) => !s.swap.processRunning);
  const [activeStep, error] = getActiveStep(dbState, processExited);

  return (
    <Stepper activeStep={activeStep}>
      <Step key={0}>
        <StepLabel
          optional={<Typography variant="caption">~20min</Typography>}
          error={error && activeStep === 0}
        >
          Locking your BTC
        </StepLabel>
      </Step>
      <Step key={1}>
        <StepLabel
          optional={<Typography variant="caption">~20min</Typography>}
          error={error && activeStep === 1}
        >
          They lock their XMR
        </StepLabel>
      </Step>
      <Step key={2}>
        <StepLabel
          optional={<Typography variant="caption">~2min</Typography>}
          error={error && activeStep === 2}
        >
          They redeem the BTC
        </StepLabel>
      </Step>
      <Step key={3}>
        <StepLabel
          optional={<Typography variant="caption">~2min</Typography>}
          error={error && activeStep === 3}
        >
          Redeeming your XMR
        </StepLabel>
      </Step>
    </Stepper>
  );
}
