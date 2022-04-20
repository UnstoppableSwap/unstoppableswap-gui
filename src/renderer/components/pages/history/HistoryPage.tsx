import { Typography } from '@material-ui/core';
import HistoryTable from './table/HistoryTable';
import SwapDialog from '../../modal/swap/SwapDialog';
import { useAppSelector } from '../../../../store/hooks';
import SwapTxLockAlertsBox from './alert/SwapTxLockAlertsBox';

export default function HistoryPage() {
  const showDialog = useAppSelector((state) => state.swap.state !== null);

  return (
    <>
      <Typography variant="h3">History</Typography>
      <SwapTxLockAlertsBox />
      <HistoryTable />
      <SwapDialog open={showDialog} onClose={() => {}} />
    </>
  );
}
