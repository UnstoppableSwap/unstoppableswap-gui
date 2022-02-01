import { Button, makeStyles, Paper, Typography } from '@material-ui/core';
import { clipboard } from 'electron';

const useStyles = makeStyles((theme) => ({
  logsOuter: {
    overflow: 'auto',
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    maxHeight: '10rem',
  },
  copyButton: {
    marginTop: theme.spacing(1),
  },
}));

export default function LogsBox({ stdOut }: { stdOut: string }) {
  const classes = useStyles();

  function handleCopyLogs() {
    clipboard.writeText(stdOut);
  }

  return (
    <Paper className={classes.logsOuter} variant="outlined">
      <Typography component="pre" variant="body2">
        {stdOut}
      </Typography>
      <Button onClick={handleCopyLogs} className={classes.copyButton}>
        Copy
      </Button>
    </Paper>
  );
}
