import { Typography } from '@material-ui/core';
import React from 'react';
import HistoryTable from './HistoryTable';

export default function HistoryPage() {
  return (
    <>
      <Typography variant="h3">History</Typography>
      <HistoryTable />;
    </>
  );
}
