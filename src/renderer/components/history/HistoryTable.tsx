import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useAppSelector } from '../../../store/hooks';
import HistoryRow from './HistoryRow';

export default function HistoryTable() {
  const history = useAppSelector((state) => state.history);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Swap ID</TableCell>
            <TableCell>Amount (XMR)</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((dbState) => (
            <HistoryRow dbState={dbState} key={dbState.swapId} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
