import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { SwapStatePreparingBinary } from '../../../../../swap/swap-state-machine';

function LinearProgressWithLabel({
  value,
  ...props
}: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <LinearProgress variant="determinate" {...props} value={value} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

type PreparingBinaryPageProps = {
  state: SwapStatePreparingBinary;
};

export default function PreparingBinaryPage({
  state,
}: PreparingBinaryPageProps) {
  return (
    <Box>
      <Typography variant="h5">
        Downloading latest binary from Github...
      </Typography>
      <LinearProgressWithLabel
        value={(state.totalDownloadedBytes / state.contentLengthBytes) * 100}
      />
    </Box>
  );
}
