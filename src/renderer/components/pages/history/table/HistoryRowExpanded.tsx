import {
  Box,
  Link,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import {
  getHumanReadableDbStateType,
  getSwapBtcAmount,
  getSwapExchangeRate,
  getSwapTxFees,
  getSwapXmrAmount,
} from '../../../../../models/databaseModel';
import SwapLogFileOpenButton from './SwapLogFileOpenButton';
import { SwapCancelRefundButton } from './HistoryRowActions';
import { GetSwapInfoResponse } from '../../../../../models/rpcModel';
import { getBitcoinTxExplorerUrl } from '../../../../../utils/conversionUtils';
import { isTestnet } from '../../../../../store/config';
import { SwapMoneroRecoveryButton } from './SwapMoneroRecoveryButton';

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'grid',
    padding: theme.spacing(1),
    gap: theme.spacing(1),
  },
  actionsOuter: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
}));

export default function HistoryRowExpanded({
  swap,
}: {
  swap: GetSwapInfoResponse;
}) {
  const classes = useStyles();

  const { seller, startDate } = swap;
  const btcAmount = getSwapBtcAmount(swap);
  const xmrAmount = getSwapXmrAmount(swap);
  const txFees = getSwapTxFees(swap);
  const exchangeRate = getSwapExchangeRate(swap);

  return (
    <Box className={classes.outer}>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Started on</TableCell>
              <TableCell>{startDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Swap ID</TableCell>
              <TableCell>{swap.swapId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>State Name</TableCell>
              <TableCell>
                {getHumanReadableDbStateType(swap.stateName)}
              </TableCell>
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
              <TableCell>
                <Box>{seller.addresses.join(', ')}</Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bitcoin lock transaction</TableCell>
              <TableCell>
                <Link
                  href={getBitcoinTxExplorerUrl(swap.txLockId, isTestnet())}
                  target="_blank"
                >
                  {swap.txLockId}
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box className={classes.actionsOuter}>
        <SwapLogFileOpenButton
          swapId={swap.swapId}
          variant="outlined"
          size="small"
        />
        <SwapCancelRefundButton swap={swap} variant="contained" size="small" />
        <SwapMoneroRecoveryButton
          swap={swap}
          variant="contained"
          size="small"
        />
      </Box>
    </Box>
  );
}
