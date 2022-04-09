import {
  DialogTitle,
  FormControlLabel,
  makeStyles,
  Switch,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export default function SwapDialogTitle({
  title,
  debug,
  setDebug,
}: {
  title: string;
  debug: boolean;
  setDebug: (d: boolean) => void;
}) {
  const classes = useStyles();

  return (
    <DialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{title}</Typography>
      <FormControlLabel
        control={
          <Switch
            color="default"
            checked={debug}
            onChange={() => setDebug(!debug)}
          />
        }
        label="Debug"
      />
    </DialogTitle>
  );
}
