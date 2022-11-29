import { Dialog } from '@material-ui/core';
import DialogHeader from '../DialogHeader';
import { useAppDispatch, useIsRpcEndpointBusy } from '../../../../store/hooks';
import WithdrawStatePage from './WithdrawStatePage';
import { RpcMethod } from '../../../../models/rpcModel';
import { rpcResetWithdrawTxId } from '../../../../store/features/rpcSlice';

export default function WithdrawDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const isRpcEndpointBusy = useIsRpcEndpointBusy(RpcMethod.WITHDRAW_BTC);
  const dispatch = useAppDispatch();

  function onCancel() {
    if (!isRpcEndpointBusy) {
      onClose();
      dispatch(rpcResetWithdrawTxId());
    }
  }

  return (
    <Dialog
      open={open || isRpcEndpointBusy}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogHeader title="Withdraw Bitcoin" />
      <WithdrawStatePage onCancel={onCancel} />
    </Dialog>
  );
}
