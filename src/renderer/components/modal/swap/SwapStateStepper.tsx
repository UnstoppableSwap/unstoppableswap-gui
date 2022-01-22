import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import {
  DbStatePathType,
  isMergedBtcCancelledDbState,
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
  getTypeOfPathDbState,
} from 'models/databaseModel';
import { useActiveDbState, useAppSelector } from '../../../../store/hooks';

function getActiveStep(
  dbState: MergedDbState | null,
  processExited: boolean
): [DbStatePathType, number, boolean] {
  if (dbState) {
    const pathType = getTypeOfPathDbState(dbState);

    if (pathType === DbStatePathType.HAPPY_PATH) {
      if (isMergedExecutionSetupDoneDbState(dbState)) {
        return [pathType, 0, processExited];
      }
      if (isMergedBtcLockedDbState(dbState)) {
        return [pathType, 0, processExited];
      }
      if (isMergedXmrLockProofReceivedDbState(dbState)) {
        return [pathType, 1, processExited];
      }
      if (isMergedXmrLockedDbState(dbState)) {
        return [pathType, 2, processExited];
      }
      if (isMergedEncSigSentDbState(dbState)) {
        return [pathType, 2, processExited];
      }
      if (isMergedBtcRedeemedDbState(dbState)) {
        return [pathType, 3, processExited];
      }
      if (isMergedDoneXmrRedeemedDbState(dbState)) {
        return [pathType, 4, false];
      }
    } else {
      if (isMergedCancelTimelockExpiredDbState(dbState)) {
        return [pathType, 0, processExited];
      }
      if (isMergedBtcCancelledDbState(dbState)) {
        return [pathType, 1, processExited];
      }
      if (isMergedDoneBtcRefundedDbState(dbState)) {
        return [pathType, 2, false];
      }
      if (isMergedDoneBtcPunishedDbState(dbState)) {
        return [pathType, 1, true];
      }
    }
    return [pathType, 0, false];
  }
  return [DbStatePathType.HAPPY_PATH, 0, false];
}

function HappyPathStepper({
  activeStep,
  error,
}: {
  activeStep: number;
  error: boolean;
}) {
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

function UnhappyPathStepper({
  activeStep,
  error,
}: {
  activeStep: number;
  error: boolean;
}) {
  return (
    <Stepper activeStep={activeStep}>
      <Step key={0}>
        <StepLabel
          optional={<Typography variant="caption">~20min</Typography>}
          error={error && activeStep === 0}
        >
          Cancelling swap
        </StepLabel>
      </Step>
      <Step key={1}>
        <StepLabel
          optional={<Typography variant="caption">~20min</Typography>}
          error={error && activeStep === 1}
        >
          Refunding your BTC
        </StepLabel>
      </Step>
    </Stepper>
  );
}

export default function SwapStateStepper() {
  const dbState = useActiveDbState();
  const processExited = useAppSelector((s) => !s.swap.processRunning);
  const [pathType, activeStep, error] = getActiveStep(dbState, processExited);

  if (pathType === DbStatePathType.HAPPY_PATH) {
    return <HappyPathStepper activeStep={activeStep} error={error} />;
  }
  return <UnhappyPathStepper activeStep={activeStep} error={error} />;
}
