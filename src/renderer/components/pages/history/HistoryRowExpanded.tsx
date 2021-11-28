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
import React from 'react';
import { MergedDbState } from '../../../../models/databaseModel';
import {
  getSwapBtcAmount,
  getSwapTxFees,
  getSwapXmrAmount,
} from '../../../../utils/parseUtils';
import { SwapCancelRefundButton, SwapResumeButton } from './HistoryRowActions';

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

function ActionBar({ dbState }: { dbState: MergedDbState }) {
  const classes = useStyles();
  return (
    <Box className={classes.outerActionBar}>
      <SwapResumeButton dbState={dbState} size="small" variant="outlined" />
      <SwapCancelRefundButton
        dbState={dbState}
        size="small"
        variant="outlined"
      />
    </Box>
  );
}

export default function HistoryRowExpanded({
  dbState,
}: {
  dbState: MergedDbState;
}) {
  const classes = useStyles();

  const btcAmount = getSwapBtcAmount(dbState);
  const xmrAmount = getSwapXmrAmount(dbState);
  const txFees = getSwapTxFees(dbState);
  const { provider } = dbState;

  const exchangeRate = btcAmount ? `${btcAmount / xmrAmount} XMR/BTC` : '?';

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
              <TableCell>{exchangeRate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bitcoin Network Fees</TableCell>
              <TableCell>{txFees} BTC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Provider Address</TableCell>
              <TableCell>{provider.multiAddr}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Provider Peer ID</TableCell>
              <TableCell>{provider.peerId}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <ActionBar dbState={dbState} />
    </Box>
  );
}
