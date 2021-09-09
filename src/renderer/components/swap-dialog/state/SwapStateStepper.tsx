import { Paper, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import React from 'react';
import { SwapState } from '../../../../swap/swap-state-machine';

type SwapStateProgressBarProps = {
  state: SwapState;
};

function getActiveStep(state: SwapState) {
  switch (state.state) {
    case 'preparing binary':
      return 0;
    case 'initiated':
      return 0;
    case 'received quote':
      return 0;
    case 'waiting for btc deposit':
      return 1;
    case 'started':
      return 1;
    case 'btc lock tx is in mempool':
      return 1;
    case 'xmr lock tx is in mempool':
      return 2;
    case 'xmr redeem tx is in mempool':
      return 4;
    default:
      return 0;
  }
}

export default function SwapStateStepper({ state }: SwapStateProgressBarProps) {
  const activeStep = getActiveStep(state);

  return (
    <Paper elevation={3}>
      <Stepper activeStep={activeStep}>
        <Step key={0}>
          <StepLabel
            optional={<Typography variant="caption">~1min</Typography>}
          >
            Starting swap
          </StepLabel>
        </Step>
        <Step key={1}>
          <StepLabel
            optional={<Typography variant="caption">~20min</Typography>}
          >
            Locking your BTC
          </StepLabel>
        </Step>
        <Step key={2}>
          <StepLabel
            optional={<Typography variant="caption">~20min</Typography>}
          >
            Their lock their XMR
          </StepLabel>
        </Step>
        <Step key={3}>
          <StepLabel
            optional={<Typography variant="caption">~5min</Typography>}
          >
            They redeem the BTC
          </StepLabel>
        </Step>
        <Step key={4}>
          <StepLabel
            optional={<Typography variant="caption">~2min</Typography>}
          >
            Redeeming your XMR
          </StepLabel>
        </Step>
      </Stepper>
    </Paper>
  );
}
