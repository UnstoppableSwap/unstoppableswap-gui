import RefreshIcon from '@material-ui/icons/Refresh';
import { CircularProgress } from '@material-ui/core';
import { useAppSelector } from '../../../../store/hooks';
import IpcInvokeButton from '../../IpcInvokeButton';

export default function WalletRefreshButton() {
  const checkingBalance = useAppSelector(
    (state) => state.balance.processRunning
  );

  return (
    <IpcInvokeButton
      loadIcon={<CircularProgress size={24} />}
      size="small"
      isIconButton
      endIcon={<RefreshIcon />}
      isLoadingOverride={checkingBalance}
      ipcArgs={[]}
      ipcChannel="spawn-balance-check"
    />
  );
}
