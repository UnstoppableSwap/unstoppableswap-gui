import { Tooltip } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button/Button';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from '@material-ui/core/colors';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {
  MergedDbState,
  isSwapResumable,
  isMergedDoneXmrRedeemedDbState,
  isMergedDoneBtcRefundedDbState,
  isMergedDoneBtcPunishedDbState,
} from '../../../../../models/databaseModel';
import IpcInvokeButton from '../../../IpcInvokeButton';

export function SwapResumeButton({
  dbState,
  ...props
}: { dbState: MergedDbState } & ButtonProps) {
  const resumable = isSwapResumable(dbState);

  return (
    <IpcInvokeButton
      variant="contained"
      color="primary"
      disabled={!resumable}
      ipcChannel="resume-buy-xmr"
      ipcArgs={[dbState.swapId]}
      endIcon={<PlayArrowIcon />}
      {...props}
    >
      Resume
    </IpcInvokeButton>
  );
}

export default function HistoryRowActions({
  dbState,
}: {
  dbState: MergedDbState;
}) {
  if (isMergedDoneXmrRedeemedDbState(dbState)) {
    return (
      <Tooltip title="The swap is completed because you have redeemed the XMR">
        <DoneIcon style={{ color: green[500] }} />
      </Tooltip>
    );
  }

  if (isMergedDoneBtcRefundedDbState(dbState)) {
    return (
      <Tooltip title="The swap is completed because your BTC have been refunded">
        <DoneIcon style={{ color: green[500] }} />
      </Tooltip>
    );
  }

  if (isMergedDoneBtcPunishedDbState(dbState)) {
    return (
      <Tooltip title="The swap is completed because you have been punished">
        <ErrorIcon style={{ color: red[500] }} />
      </Tooltip>
    );
  }

  return <SwapResumeButton dbState={dbState} />;
}
