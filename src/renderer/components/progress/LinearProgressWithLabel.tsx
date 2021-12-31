import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from '@material-ui/core';

export default function LinearProgressWithLabel({
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
