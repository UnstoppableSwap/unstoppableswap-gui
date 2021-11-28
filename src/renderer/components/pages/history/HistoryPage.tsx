import { Typography } from '@material-ui/core';
import React from 'react';
import HistoryTable from './HistoryTable';
import SwapDialog from '../../modal/swap/SwapDialog';
import { useAppSelector } from '../../../../store/hooks';

export default function HistoryPage() {
  const showDialog = useAppSelector((state) => state.swap.state !== null);

  return (
    <>
      <Typography variant="h3">History</Typography>
      <HistoryTable />
      <SwapDialog open={showDialog} onClose={() => {}} />
    </>
  );
}
