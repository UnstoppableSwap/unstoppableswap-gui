import {
  Box,
  LinearProgress,
  Link,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';

type TransactionInfoBoxProps = {
  title: string;
  txId: string;
  explorerUrl: string;
  additionalText: string | null | JSX.Element;
  loading: boolean;
  icon: JSX.Element;
};

const useStyles = makeStyles((theme) => ({
  outer: {
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    overflow: 'hidden',
  },
  upperContent: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  additionalText: {
    paddingTop: theme.spacing(0.5),
  },
}));

export default function TransactionInfoBox({
  title,
  txId,
  explorerUrl,
  additionalText,
  icon,
  loading,
}: TransactionInfoBoxProps) {
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.outer}>
      <Typography variant="subtitle1">{title}</Typography>
      <Box className={classes.upperContent}>
        {icon}
        <Typography variant="h5">{txId}</Typography>
      </Box>
      {loading ? <LinearProgress variant="indeterminate" /> : null}
      <Typography variant="subtitle2" className={classes.additionalText}>
        {additionalText}
      </Typography>
      <Typography variant="body1">
        <Link href={explorerUrl} target="_blank">
          View on explorer
        </Link>
      </Typography>
    </Paper>
  );
}
