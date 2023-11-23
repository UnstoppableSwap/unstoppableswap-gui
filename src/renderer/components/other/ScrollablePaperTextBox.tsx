import { Box, Button, Divider, Paper, Typography } from '@material-ui/core';
import { ReactNode } from 'react';

export default function ScrollablePaperTextBox({
  children,
  title,
  copyValue,
}: {
  children: ReactNode;
  title: string;
  copyValue: string;
}) {
  function onCopy() {
    navigator.clipboard.writeText(copyValue);
  }

  return (
    <Paper
      variant="outlined"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '0.5rem',
        width: '100%',
      }}
    >
      <Typography>{title}</Typography>
      <Divider />
      <Box
        style={{
          overflow: 'auto',
          whiteSpace: 'nowrap',
          maxHeight: '10rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {children}
      </Box>
      <Box>
        <Button variant="outlined" onClick={onCopy}>
          Copy
        </Button>
      </Box>
    </Paper>
  );
}
