import React from 'react';
import {
  Box,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useAppSelector } from '../../../../store/hooks';
import HistoryRow from './HistoryRow';

const useStyles = makeStyles((theme) => ({
  outer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function HistoryTable() {
  const classes = useStyles();
  const history = useAppSelector((state) => state.history);

  return (
    <Box className={classes.outer}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Amount</TableCell>
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
    </Box>
  );
}
