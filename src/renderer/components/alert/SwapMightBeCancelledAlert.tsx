import { makeStyles } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { MergedDbState } from '../../../models/databaseModel';
import { getTimelockStatus } from '../../../utils/parseUtils';
import HumanizedBitcoinBlockDuration from '../other/HumanizedBitcoinBlockDuration';

const useStyles = makeStyles((theme) => ({
  outer: {
    marginBottom: theme.spacing(1),
  },
  list: {
    margin: theme.spacing(0.25),
  },
}));

export default function SwapMightBeCancelledAlert({
  dbState,
  bobBtcLockTxConfirmations,
}: {
  dbState: MergedDbState;
  bobBtcLockTxConfirmations: number;
}) {
  const classes = useStyles();

  const timelockStatus = getTimelockStatus(
    dbState.state.Bob.ExecutionSetupDone.state2.cancel_timelock,
    dbState.state.Bob.ExecutionSetupDone.state2.punish_timelock,
    bobBtcLockTxConfirmations
  );

  if (bobBtcLockTxConfirmations < 3) {
    return <></>;
  }

  return (
    <Alert severity="warning" className={classes.outer} variant="filled">
      <AlertTitle>Be careful!</AlertTitle>
      The swap provider has taken a long time to lock their Monero. This might
      mean that:
      <ul className={classes.list}>
        <li>They are a malicious actor</li>
        <li>
          There is a technical issue that prevents them from locking their funds
        </li>
      </ul>
      <br />
      There is still hope for the swap to be successful but you have to be extra
      careful. Regardless of the reason, it is important that you refund the
      swap within the required time period if the swap is not completed. If you
      fail to to do so, you will be punished and lose your money.
      <ul className={classes.list}>
        {timelockStatus.type === 'none' && (
          <li>
            <strong>
              You will be able to refund in about{' '}
              <HumanizedBitcoinBlockDuration
                blocks={timelockStatus.blocksUntilRefund}
              />
            </strong>
          </li>
        )}
        {(timelockStatus.type === 'none' ||
          timelockStatus.type === 'cancelExpired') && (
          <strong>
            <li>
              If you have not refunded or completed the swap in about{' '}
              <HumanizedBitcoinBlockDuration
                blocks={timelockStatus.blocksUntilPunish}
              />
              , you will lose your funds.
            </li>
          </strong>
        )}
        <li>
          As long as you see this screen, the swap should be refunded
          automatically when the time comes. If it is not you have to manually
          refund by navigating to the History page.
        </li>
      </ul>
    </Alert>
  );
}
