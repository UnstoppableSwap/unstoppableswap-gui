import { CircularProgress } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import IpcInvokeButton from '../../IpcInvokeButton';

export default function WalletRefreshButton() {
  const checkingBalance = useIsRpcEndpointBusy(RpcMethod.GET_BTC_BALANCE);

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
