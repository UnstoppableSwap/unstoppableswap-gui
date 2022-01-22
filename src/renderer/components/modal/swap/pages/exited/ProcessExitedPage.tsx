import {
  isMergedDoneBtcPunishedDbState,
  isMergedDoneBtcRefundedDbState,
  isMergedDoneXmrRedeemedDbState,
} from 'models/databaseModel';
import {
  isSwapStateBtcRefunded,
  isSwapStateXmrRedeemInMempool,
  SwapStateProcessExited,
} from '../../../../../../models/storeModel';
import { useActiveDbState } from '../../../../../../store/hooks';
import XmrRedeemInMempoolPage from '../done/XmrRedeemInMempoolPage';
import BitcoinPunishedPage from '../done/BitcoinPunishedPage';
// eslint-disable-next-line import/no-cycle
import SwapStatePage from '../SwapStatePage';
import BitcoinRefundedPage from '../done/BitcoinRefundedPage';
import ProcesExitedAndNotDonePage from './ProcesExitedAndNotDonePage';

type ProcessExitedPageProps = {
  state: SwapStateProcessExited;
};

export default function ProcessExitedPage({ state }: ProcessExitedPageProps) {
  const dbState = useActiveDbState();

  // If we have a swap state, for a "done" state we should use it to display additional information that can't be extracted from the database
  if (
    isSwapStateXmrRedeemInMempool(state.prevState) ||
    isSwapStateBtcRefunded(state.prevState)
  ) {
    return <SwapStatePage swapState={state.prevState} />;
  }

  // If we don't have a swap state for a "done" state, we should fall back to using the database to display as much information as we can
  if (dbState) {
    if (isMergedDoneXmrRedeemedDbState(dbState)) {
      return <XmrRedeemInMempoolPage state={null} />;
    }
    if (isMergedDoneBtcRefundedDbState(dbState)) {
      return <BitcoinRefundedPage state={null} />;
    }
    if (isMergedDoneBtcPunishedDbState(dbState)) {
      return <BitcoinPunishedPage />;
    }
  }

  // If the swap is not a "done" state we should tell the user and show logs
  return <ProcesExitedAndNotDonePage state={state} dbState={dbState} />;
}
