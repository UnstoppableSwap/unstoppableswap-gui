import {
  Box,
  Collapse,
  IconButton,
  makeStyles,
  TableCell,
  TableRow,
} from '@material-ui/core';
import { useState } from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {
  MergedDbState,
  getSwapBtcAmount,
  getSwapXmrAmount,
  getHumanReadableDbStateType,
} from '../../../../../models/databaseModel';
import HistoryRowActions from './HistoryRowActions';
import HistoryRowExpanded from './HistoryRowExpanded';

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
  btcAmount: number;
}) {
  const classes = useStyles();

  return (
    <Box className={classes.amountTransferContainer}>
      {btcAmount.toFixed(6)} BTC
      <ArrowForwardIcon />
      {xmrAmount.toFixed(6)} XMR
    </Box>
  );
}

export default function HistoryRow({ dbState }: HistoryRowProps) {
  const btcAmount = getSwapBtcAmount(dbState);
  const xmrAmount = getSwapXmrAmount(dbState);

  const [expanded, setExpanded] = useState(false);
  const humanReadableStateType = getHumanReadableDbStateType(dbState.type);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{dbState.swapId.substr(0, 5)}...</TableCell>
        <TableCell>
          <AmountTransfer xmrAmount={xmrAmount} btcAmount={btcAmount} />
        </TableCell>
        <TableCell>{humanReadableStateType}</TableCell>
        <TableCell>
          <HistoryRowActions dbState={dbState} />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={expanded} timeout="auto">
            {expanded && <HistoryRowExpanded dbState={dbState} />}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
