import {
  isWithdrawStateInitiated,
  isWithdrawStateProcessExited,
  isWithdrawStateWithdrawTxInMempool,
  WithdrawState,
} from '../../../../models/storeModel';
import AddressInputPage from './pages/AddressInputPage';
import InitiatedPage from './pages/InitiatedPage';
import BtcTxInMempoolPageContent from './pages/BitcoinWithdrawTxInMempoolPage';
import ProcessExitedNotDone from './pages/ProcessExitedNotDone';

export default function WithdrawStatePage({
  onCancel,
  state,
}: {
  onCancel: () => void;
  state: WithdrawState | null;
}) {
  if (state === null) {
    return <AddressInputPage onCancel={onCancel} />;
  }
  if (isWithdrawStateInitiated(state)) {
    return <InitiatedPage onCancel={onCancel} />;
  }
  if (isWithdrawStateWithdrawTxInMempool(state)) {
    return <BtcTxInMempoolPageContent state={state} onCancel={onCancel} />;
  }
  if (isWithdrawStateProcessExited(state)) {
    if (isWithdrawStateWithdrawTxInMempool(state.prevState)) {
      return (
        <BtcTxInMempoolPageContent
          onCancel={onCancel}
          state={state.prevState}
        />
      );
    }
    return <ProcessExitedNotDone onCancel={onCancel} state={state} />;
  }
  return <>No information to display</>;
}
