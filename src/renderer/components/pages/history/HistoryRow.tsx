import { Box, makeStyles, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  isBtcLockedDbState,
  MergedDbState,
} from '../../../../models/databaseModel';
import { pionerosToXmr, satsToBtc } from '../../../../utils/currencyUtils';
import HistoryRowActions from './HistoryRowActions';

type HistoryRowProps = {
  dbState: MergedDbState;
};

const useStyles = makeStyles((theme) => ({
  amountTransferContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

function AmountTransfer({
  btcAmount,
  xmrAmount,
}: {
  xmrAmount: number;
  btcAmount: number | null;
}) {
  const classes = useStyles();

  return (
    <Box className={classes.amountTransferContainer}>
      {btcAmount ? `${btcAmount.toFixed(6)} BTC ` : '?'}
      <ArrowForwardIcon />
      {`${xmrAmount.toFixed(5)} XMR`}
    </Box>
  );
}

export default function HistoryRow({ dbState }: HistoryRowProps) {
  const btcAmount = isBtcLockedDbState(dbState.state)
    ? satsToBtc(
        dbState.state.Bob.BtcLocked.state3.tx_lock.inner.global.unsigned_tx
          .output[0]?.value
      )
    : null;
  const xmrAmount = pionerosToXmr(
    dbState.state.Bob.ExecutionSetupDone.state2.xmr
  );

  return (
    <TableRow>
      <TableCell>{dbState.swapId.substr(0, 5)}...</TableCell>
      <TableCell>
        <AmountTransfer xmrAmount={xmrAmount} btcAmount={btcAmount} />
      </TableCell>
      <TableCell>
        {btcAmount ? (btcAmount / xmrAmount).toFixed(5) : '?'} XMR/BTC
      </TableCell>
      <TableCell>{dbState.type}</TableCell>
      <TableCell>
        <HistoryRowActions dbState={dbState} />
      </TableCell>
    </TableRow>
  );
}
