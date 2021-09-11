import { CircularProgress, Typography } from '@material-ui/core';
import React from 'react';
import { SwapStateStarted } from '../../../../../swap/swap-state-machine';

type StartedPageProps = {
  state: SwapStateStarted;
};

export default function StartedPage({ state }: StartedPageProps) {
  return (
    <>
      <Typography variant="h5">
        Signing and publishing Bitcoin lock transaction
      </Typography>
      <CircularProgress />
    </>
  );
}
