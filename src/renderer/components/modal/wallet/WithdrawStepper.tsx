import { Step, StepLabel, Stepper } from '@material-ui/core';
import { useAppSelector } from '../../../../store/hooks';
import {
  isWithdrawStateInitiated,
  isWithdrawStateProcessExited,
  WithdrawState,
} from '../../../../models/storeModel';

function getActiveStep(withdrawState: WithdrawState | null) {
  if (isWithdrawStateInitiated(withdrawState)) {
    return 1;
  }
  if (isWithdrawStateProcessExited(withdrawState)) {
    return 2;
  }
  return 0;
}

export default function WithdrawStepper() {
  const activeStep = useAppSelector((s) => getActiveStep(s.withdraw.state));
  const error = useAppSelector(
    (s) =>
      isWithdrawStateProcessExited(s.withdraw.state) &&
      s.withdraw.state.exitCode !== 0
  );

  return (
    <Stepper activeStep={activeStep}>
      <Step key={0}>
        <StepLabel>Enter withdraw address</StepLabel>
      </Step>
      <Step key={2}>
        <StepLabel error={error}>Transfer funds to wallet</StepLabel>
      </Step>
    </Stepper>
  );
}
