import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
  Typography,
} from '@material-ui/core';
import { useAppSelector } from '../../../../../store/hooks';
import WithdrawStepper from '../WithdrawStepper';
import {
  isWithdrawStateInitiated,
  isWithdrawStateProcessExited,
  isWithdrawStateWithdrawTxInMempool,
  WithdrawStateProcessExited,
  WithdrawStateWithdrawTxInMempool,
} from '../../../../../models/storeModel';
import CircularProgressWithSubtitle from '../../swap/CircularProgressWithSubtitle';
import TransactionInfoBox from '../../swap/TransactionInfoBox';
import { getBitcoinTxExplorerUrl } from '../../../../../utils/currencyUtils';
import { isTestnet } from '../../../../../store/config';
import BitcoinIcon from '../../../icons/BitcoinIcon';

function InitiatedPageContent() {
  return <CircularProgressWithSubtitle description="Withdrawing Bitcoin" />;
}

function BtcTxInMempoolPageContent({
  state,
}: {
  state: WithdrawStateWithdrawTxInMempool;
}) {
  const explorerUrl = getBitcoinTxExplorerUrl(state.txid, isTestnet());

  return (
    <>
      <DialogContentText>
        All funds of the internal Bitcoin wallet have been transferred to your
        withdraw address.
      </DialogContentText>
      <TransactionInfoBox
        txId={state.txid}
        explorerUrl={explorerUrl}
        icon={<BitcoinIcon />}
        loading={false}
        title="Bitcoin Withdraw Transaction"
        additionalText={null}
      />
    </>
  );
}

function ProcessExitedContentPage({
  state,
}: {
  state: WithdrawStateProcessExited;
}) {
  const stdOut = useAppSelector((s) => s.withdraw.stdOut);

  if (isWithdrawStateWithdrawTxInMempool(state.prevState)) {
    return <BtcTxInMempoolPageContent state={state.prevState} />;
  }
  return (
    <DialogContentText>
      <Typography>Failed to withdraw btc!</Typography>
      <Typography>Exit code: {state.exitCode}</Typography>
      <Paper>
        <pre>{stdOut}</pre>
      </Paper>
    </DialogContentText>
  );
}

function CurrentPage() {
  const withdrawState = useAppSelector((state) => state.withdraw.state);

  if (isWithdrawStateInitiated(withdrawState)) {
    return <InitiatedPageContent />;
  }
  if (isWithdrawStateWithdrawTxInMempool(withdrawState)) {
    return <BtcTxInMempoolPageContent state={withdrawState} />;
  }
  if (isWithdrawStateProcessExited(withdrawState)) {
    return <ProcessExitedContentPage state={withdrawState} />;
  }
  return <></>;
}

export default function RunningPage({ onCancel }: { onCancel: () => void }) {
  const processRunning = useAppSelector(
    (state) => state.withdraw.processRunning
  );

  return (
    <>
      <DialogContent dividers>
        <DialogContentText>
          <CurrentPage />
        </DialogContentText>
        <WithdrawStepper />
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={onCancel}
          disabled={processRunning}
          color="primary"
          variant="contained"
        >
          Done
        </Button>
      </DialogActions>
    </>
  );
}
