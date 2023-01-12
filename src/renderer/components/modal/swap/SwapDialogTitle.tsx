import {
  Box,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  Switch,
  Typography,
} from '@material-ui/core';
import TorStatusBadge from './pages/TorStatusBadge';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    gridGap: theme.spacing(1),
  },
}));

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
      <Box className={classes.rightSide}>
        <TorStatusBadge />
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
      </Box>
    </DialogTitle>
  );
}
