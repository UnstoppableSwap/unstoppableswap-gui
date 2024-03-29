import { Button, DialogActions, DialogContentText } from '@material-ui/core';
import { WithdrawStateWithdrawTxInMempool } from '../../../../../models/storeModel';
import BitcoinTransactionInfoBox from '../../swap/BitcoinTransactionInfoBox';
import { useAppSelector } from '../../../../../store/hooks';
import WithdrawDialogContent from '../WithdrawDialogContent';

export default function BtcTxInMempoolPageContent({
  state,
  onCancel,
}: {
  state: WithdrawStateWithdrawTxInMempool;
  onCancel: () => void;
}) {
  const processRunning = useAppSelector((s) => s.withdraw.processRunning);

  return (
    <>
      <WithdrawDialogContent>
        <DialogContentText>
          All funds of the internal Bitcoin wallet have been transferred to your
          withdraw address.
        </DialogContentText>
        <BitcoinTransactionInfoBox
          txId={state.txid}
          loading={false}
          title="Bitcoin Withdraw Transaction"
          additionalContent={null}
        />
      </WithdrawDialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="text">
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
