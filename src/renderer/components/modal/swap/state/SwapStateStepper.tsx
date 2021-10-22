import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import { SwapState, SwapStateType } from 'models/storeModel';
import React from 'react';

type SwapStateProgressBarProps = {
  state: SwapState;
};

function getActiveStep(state: SwapState) {
  switch (state.type) {
    case SwapStateType.DOWNLOADING_BINARY:
      return 0;
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
      return 3;
    default:
      return 0;
  }
}

export default function SwapStateStepper({ state }: SwapStateProgressBarProps) {
  const activeStep = getActiveStep(state);

  return (
    <Stepper activeStep={activeStep}>
      <Step key={0}>
        <StepLabel optional={<Typography variant="caption">~20min</Typography>}>
          Locking your BTC
        </StepLabel>
      </Step>
      <Step key={1}>
        <StepLabel optional={<Typography variant="caption">~20min</Typography>}>
          They lock their XMR
        </StepLabel>
      </Step>
      <Step key={2}>
        <StepLabel optional={<Typography variant="caption">~2min</Typography>}>
          They redeem the BTC
        </StepLabel>
      </Step>
      <Step key={3}>
        <StepLabel optional={<Typography variant="caption">~2min</Typography>}>
          Redeeming your XMR
        </StepLabel>
      </Step>
    </Stepper>
  );
}
