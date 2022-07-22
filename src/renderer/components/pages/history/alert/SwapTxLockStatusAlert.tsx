import { Alert, AlertTitle } from '@material-ui/lab/';
import { useAppSelector } from '../../../../../store/hooks';
import { MergedDbState } from '../../../../../models/databaseModel';
import { SwapResumeButton } from '../table/HistoryRowActions';
import {
  TimelockStatus,
  TimelockStatusType,
} from '../../../../../models/storeModel';
import { getTimelockStatus } from '../../../../../utils/parseUtils';

function SwapAlertStatusText({
  timelockStatus,
}: {
  timelockStatus: TimelockStatus;
}) {
  switch (timelockStatus.type) {
    case TimelockStatusType.NONE:
      return (
        <>
          Resume the swap as soon as possible!
          <ul
            style={{
              padding: '0px',
              margin: '0px',
            }}
          >
            <li>
              You will be able to refund in about{' '}
              {timelockStatus.blocksUntilRefund * 10} minutes (
              {timelockStatus.blocksUntilRefund} blocks).
            </li>
            <li>
              If you have not refunded or completed the swap in about{' '}
              {timelockStatus.blocksUntilPunish * 10} minutes (
              {timelockStatus.blocksUntilPunish} blocks), you will loose your
              funds.
            </li>
          </ul>
        </>
      );
    case TimelockStatusType.REFUND_EXPIRED:
      return (
        <>
          Immediately resume the swap! You only have about{' '}
          {timelockStatus.blocksUntilPunish * 10}
          minutes ({timelockStatus.blocksUntilPunish} blocks) left to refund.
          After that time has passed, you will loose your funds.
        </>
      );
    default:
      return (
        <>
          Immediately resume the swap! You are in immediate danger of losing your funds.
        </>
      );
  }
}

export default function SwapTxLockStatusAlert({
  dbState,
}: {
  dbState: MergedDbState;
}): JSX.Element {
  const timelockStatus = useAppSelector((state) => {
    const txStatus = state.electrum.find(
      (tx) => tx.transaction.swapId === dbState.swapId
    )?.status;

    // If confirmations is null but we still have a status for the tx, we can assume that the tx is still in the mempool
    const confirmations =
      txStatus === undefined ? undefined : txStatus.confirmations ?? 0;

    const { cancel_timelock: refundTimelock, punish_timelock: punishTimelock } =
      dbState.state.Bob.ExecutionSetupDone.state2;

    return getTimelockStatus(refundTimelock, punishTimelock, confirmations);
  });

  return (
    <Alert
      key={dbState.swapId}
      severity="warning"
      action={<SwapResumeButton dbState={dbState} />}
    >
      <AlertTitle>Swap {dbState.swapId} is unfinished</AlertTitle>
      <SwapAlertStatusText timelockStatus={timelockStatus} />
    </Alert>
  );
}
