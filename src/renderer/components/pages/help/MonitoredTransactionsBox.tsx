import {
  Box,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useAppSelector } from '../../../../store/hooks';
import InfoBox from '../../modal/swap/InfoBox';

export default function MonitoredTransactionBox() {
  const transactions = useAppSelector((s) => s.electrum);

  return (
    <InfoBox
      title="Monitored transactions"
      loading={false}
      additionalContent={<></>}
      icon={<></>}
      mainContent={
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Swap ID</TableCell>
              <TableCell>Confirmations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow>
                <TableCell>{tx.transaction.txid}</TableCell>
                <TableCell>{tx.transaction.swapId}</TableCell>
                <TableCell>{tx.status.confirmations ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
    />
  );
}
