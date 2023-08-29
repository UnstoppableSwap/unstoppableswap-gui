import { Alert, AlertTitle } from '@material-ui/lab/';
import { SwapResumeButton } from '../pages/history/table/HistoryRowActions';
import HumanizedBitcoinBlockDuration from '../other/HumanizedBitcoinBlockDuration';
import {
  GetSwapInfoResponse,
  isSwapTimelockInfoCancelled,
  isSwapTimelockInfoNone,
} from '../../../models/rpcModel';

function SwapAlertStatusText({ swap }: { swap: GetSwapInfoResponse }) {
  if (swap.timelock === null) {
    return <></>;
  }

  const punishTimelockOffset = swap.punishTimelock;

  if (isSwapTimelockInfoNone(swap.timelock)) {
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
            <HumanizedBitcoinBlockDuration
              blocks={swap.timelock.None.blocks_left}
            />
          </li>
          <li>
            You will lose your funds, if you have not refunded or completed the
            swap in about{' '}
            <HumanizedBitcoinBlockDuration
              blocks={swap.timelock.None.blocks_left + punishTimelockOffset}
            />
          </li>
        </ul>
      </>
    );
  }

  if (isSwapTimelockInfoCancelled(swap.timelock)) {
    return (
      <>
        Immediately resume the swap! You only have about{' '}
        <HumanizedBitcoinBlockDuration
          blocks={swap.timelock.Cancel.blocks_left}
        />{' '}
        left to refund. After that time has passed, you will lose your funds.
      </>
    );
  }

  return (
    <>Immediately resume the swap! You are in danger of losing your funds.</>
  );
}

export default function SwapTxLockStatusAlert({
  swap,
}: {
  swap: GetSwapInfoResponse;
}): JSX.Element {
  return (
    <Alert
      key={swap.swapId}
      severity="warning"
      action={<SwapResumeButton swap={swap} />}
      variant="filled"
    >
      <AlertTitle>Swap {swap.swapId} is unfinished</AlertTitle>
      <SwapAlertStatusText swap={swap} />
    </Alert>
  );
}
