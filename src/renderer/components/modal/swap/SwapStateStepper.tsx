import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import { DbStatePathType, getTypeOfPathDbState } from 'models/databaseModel';
import { useActiveSwapInfo, useAppSelector } from '../../../../store/hooks';
import { SwapStateName } from '../../../../models/rpcModel';

function getActiveStep(
  stateName: SwapStateName | null,
  processExited: boolean
): [DbStatePathType, number, boolean] {
  if (stateName) {
    const pathType = getTypeOfPathDbState(stateName);

    if (pathType === DbStatePathType.HAPPY_PATH) {
      if (stateName === SwapStateName.SwapSetupCompleted) {
        return [pathType, 0, processExited];
      }
      if (stateName === SwapStateName.BtcLocked) {
        return [pathType, 0, processExited];
      }
      if (stateName === SwapStateName.XmrLockProofReceived) {
        return [pathType, 1, processExited];
      }
      if (stateName === SwapStateName.XmrLocked) {
        return [pathType, 2, processExited];
      }
      if (stateName === SwapStateName.EncSigSent) {
        return [pathType, 2, processExited];
      }
      if (stateName === SwapStateName.BtcRedeemed) {
        return [pathType, 3, processExited];
      }
      if (stateName === SwapStateName.XmrRedeemed) {
        return [pathType, 4, false];
      }
    } else {
      if (stateName === SwapStateName.CancelTimelockExpired) {
        return [pathType, 0, processExited];
      }
      if (stateName === SwapStateName.BtcCancelled) {
        return [pathType, 1, processExited];
      }
      if (stateName === SwapStateName.BtcRefunded) {
        return [pathType, 2, false];
      }
      if (stateName === SwapStateName.BtcPunished) {
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
  const stateName = useActiveSwapInfo()?.stateName ?? null;
  const processExited = useAppSelector((s) => !s.swap.processRunning);
  const [pathType, activeStep, error] = getActiveStep(stateName, processExited);

  if (pathType === DbStatePathType.HAPPY_PATH) {
    return <HappyPathStepper activeStep={activeStep} error={error} />;
  }
  return <UnhappyPathStepper activeStep={activeStep} error={error} />;
}
