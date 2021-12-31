import { CircularProgress, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ipcRenderer } from 'electron';
import { useAppSelector } from '../../../../store/hooks';

export default function WalletRefreshButton() {
  const checkingBalance = useAppSelector(
    (state) => state.balance.processRunning
  );

  async function handleRefresh() {
    await ipcRenderer.invoke('spawn-balance-check');
  }

  return (
    <IconButton disabled={checkingBalance} onClick={handleRefresh} size="small">
      {checkingBalance ? <CircularProgress size={24} /> : <RefreshIcon />}
    </IconButton>
  );
}
