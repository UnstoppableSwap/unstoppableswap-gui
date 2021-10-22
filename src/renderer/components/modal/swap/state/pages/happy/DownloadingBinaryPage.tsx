import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { SwapStateDownloadingBinary } from '../../../../../../../models/storeModel';

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

type DownloadingBinaryPageProps = {
  state: SwapStateDownloadingBinary;
};

export default function DownloadingBinaryPage({
  state,
}: DownloadingBinaryPageProps) {
  return (
    <Box>
      <Typography variant="h5" align="center">
        Downloading latest binary from Github...
      </Typography>
      <LinearProgressWithLabel
        value={(state.totalDownloadedBytes / state.contentLengthBytes) * 100}
      />
    </Box>
  );
}
