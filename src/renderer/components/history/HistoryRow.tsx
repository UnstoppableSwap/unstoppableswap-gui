import { Button, TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import { MergedDbState } from '../../../models/databaseModel';
import { pionerosToXmr } from '../../../swap/utils/unit-utils';

type HistoryRowProps = {
  dbState: MergedDbState;
};

export default function HistoryRow({ dbState }: HistoryRowProps) {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {dbState.swapId}
      </TableCell>
      <TableCell>
        {pionerosToXmr(dbState.state.Bob.ExecutionSetupDone.state2.xmr)} XMR
      </TableCell>
      <TableCell>{dbState.type}</TableCell>
      <TableCell>
        <Button>Action</Button>
      </TableCell>
    </TableRow>
  );
}
