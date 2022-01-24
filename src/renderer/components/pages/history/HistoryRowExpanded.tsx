import {
  Box,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import {
  MergedDbState,
  getSwapBtcAmount,
  getSwapExchangeRate,
  getSwapTxFees,
  getSwapXmrAmount,
} from '../../../../models/databaseModel';

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'grid',
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  outerActionBar: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

export default function HistoryRowExpanded({
  dbState,
}: {
  dbState: MergedDbState;
}) {
  const classes = useStyles();

  const btcAmount = getSwapBtcAmount(dbState);
  const xmrAmount = getSwapXmrAmount(dbState);
  const txFees = getSwapTxFees(dbState);
  const exchangeRate = getSwapExchangeRate(dbState);
  const { provider } = dbState;

  return (
    <Box className={classes.outer}>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Swap ID</TableCell>
              <TableCell>{dbState.swapId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>State Name</TableCell>
              <TableCell>{dbState.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Monero Amount</TableCell>
              <TableCell>{xmrAmount} BTC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bitcoin Amount</TableCell>
              <TableCell>{btcAmount || '?'} BTC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Exchange Rate</TableCell>
              <TableCell>{exchangeRate.toPrecision(6)} XMR/BTC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bitcoin Network Fees</TableCell>
              <TableCell>{txFees} BTC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Provider Address</TableCell>
              <TableCell>{provider.multiAddr}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
