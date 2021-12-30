import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import {
  isSwapStateProcessExited,
  SwapState,
  SwapStateType,
} from 'models/storeModel';
import React from 'react';
import { useAppSelector } from '../../../../store/hooks';

function getActiveStep(swapState: SwapState | null) {
  if (swapState === null) {
    return 0;
  }

  switch (swapState.type) {
    case SwapStateType.INITIATED:
      return 0;
    case SwapStateType.RECEIVED_QUOTE:
      return 0;
    case SwapStateType.WAITING_FOR_BTC_DEPOSIT:
      return 0;
    case SwapStateType.STARTED:
      return 0;
    case SwapStateType.BTC_LOCK_TX_IN_MEMPOOL:
      return 0;
    case SwapStateType.XMR_LOCK_TX_IN_MEMPOOL:
      return 1;
    case SwapStateType.XMR_REDEEM_IN_MEMPOOL:
      return 4;
    default:
      return 0;
  }
}

export default function SwapStateStepper() {
  const activeStep = useAppSelector((s) =>
    isSwapStateProcessExited(s.swap.state)
      ? getActiveStep(s.swap.state.prevState)
      : getActiveStep(s.swap.state)
  );
  const error = useAppSelector(
    (s) => isSwapStateProcessExited(s.swap.state) && s.swap.state.exitCode !== 0
  );

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
          /* error={ error && activeStep === 2 } */
        >
          They redeem the BTC
        </StepLabel>
      </Step>
      <Step key={3}>
        <StepLabel
          optional={<Typography variant="caption">~2min</Typography>}
          error={false /* error && activeStep === 3 */}
        >
          Redeeming your XMR
        </StepLabel>
      </Step>
    </Stepper>
  );
}
