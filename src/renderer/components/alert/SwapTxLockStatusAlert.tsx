import { Alert, AlertTitle } from '@material-ui/lab/';
import { useTimelockStatus } from '../../../store/hooks';
import { MergedDbState } from '../../../models/databaseModel';
import { SwapResumeButton } from '../pages/history/table/HistoryRowActions';
import {
  TimelockStatus,
  TimelockStatusType,
} from '../../../models/storeModel';
import { humanizedBitcoinBlockDuration } from '../../../utils/parseUtils';

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
              {humanizedBitcoinBlockDuration(timelockStatus.blocksUntilRefund)}
            </li>
            <li>
              If you have not refunded or completed the swap in about{' '}
              {humanizedBitcoinBlockDuration(timelockStatus.blocksUntilPunish)},
              you will lose your funds.
            </li>
          </ul>
        </>
      );
    case TimelockStatusType.REFUND_EXPIRED:
      return (
        <>
          Immediately resume the swap! You only have about{' '}
          {humanizedBitcoinBlockDuration(timelockStatus.blocksUntilPunish)} left
          to refund. After that time has passed, you will lose your funds.
        </>
      );
    default:
      return (
        <>
          Immediately resume the swap! You are in danger of losing your funds.
        </>
      );
  }
}

export default function SwapTxLockStatusAlert({
  dbState,
}: {
  dbState: MergedDbState;
}): JSX.Element {
  const timelockStatus = useTimelockStatus(dbState.swapId);

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
