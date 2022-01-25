import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import { WithdrawStateWithdrawTxInMempool } from '../../../../../models/storeModel';
import BitcoinTransactionInfoBox from '../../swap/transaction/BitcoinTransactionInfoBox';
import WithdrawStepper from '../WithdrawStepper';
import { useAppSelector } from '../../../../../store/hooks';

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
      <DialogContent dividers>
        <Box>
          <DialogContentText>
            All funds of the internal Bitcoin wallet have been transferred to
            your withdraw address.
          </DialogContentText>
          <BitcoinTransactionInfoBox
            txId={state.txid}
            loading={false}
            title="BTC Withdraw Transaction"
            additionalText={null}
          />
        </Box>
        <WithdrawStepper />
      </DialogContent>
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
