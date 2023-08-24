import { Tooltip } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button/Button';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from '@material-ui/core/colors';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { isSwapResumable } from '../../../../../models/databaseModel';
import IpcInvokeButton from '../../../IpcInvokeButton';
import { ExtendedSwapInfo } from '../../../../../store/features/rpcSlice';
import { SwapStateName } from '../../../../../models/rpcModel';

export function SwapResumeButton({
  swap,
  ...props
}: { swap: ExtendedSwapInfo } & ButtonProps) {
  const resumable = isSwapResumable(swap);

  return (
    <IpcInvokeButton
      variant="contained"
      color="primary"
      disabled={!resumable}
      ipcChannel="spawn-resume-swap"
      ipcArgs={[swap.swapId]}
      endIcon={<PlayArrowIcon />}
      {...props}
    >
      Resume
    </IpcInvokeButton>
  );
}

export function SwapCancelRefundButton({
  swap,
  ...props
}: { swap: ExtendedSwapInfo } & ButtonProps) {
  // TODO: actually set this value dynmically
  const cancelOrRefundable = true;

  return (
    <IpcInvokeButton
      disabled={!cancelOrRefundable}
      ipcChannel="spawn-cancel-refund"
      ipcArgs={[swap.swapId]}
      {...props}
    >
      Attempt manual Cancel & Refund
    </IpcInvokeButton>
  );
}

export default function HistoryRowActions({
  swap,
}: {
  swap: ExtendedSwapInfo;
}) {
  if (swap.state.type === SwapStateName.XmrRedeemed) {
    return (
      <Tooltip title="The swap is completed because you have redeemed the XMR">
        <DoneIcon style={{ color: green[500] }} />
      </Tooltip>
    );
  }

  if (swap.state.type === SwapStateName.BtcRefunded) {
    return (
      <Tooltip title="The swap is completed because your BTC have been refunded">
        <DoneIcon style={{ color: green[500] }} />
      </Tooltip>
    );
  }

  if (swap.state.type === SwapStateName.BtcPunished) {
    return (
      <Tooltip title="The swap is completed because you have been punished">
        <ErrorIcon style={{ color: red[500] }} />
      </Tooltip>
    );
  }

  return <SwapResumeButton swap={swap} />;
}
