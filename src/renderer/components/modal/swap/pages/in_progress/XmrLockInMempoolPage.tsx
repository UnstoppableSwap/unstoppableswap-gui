import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateXmrLockInMempool } from '../../../../../../models/storeModel';
import MoneroTransactionInfoBox from '../../transaction/MoneroTransactionInfoBox';

type XmrLockTxInMempoolPageProps = {
  state: SwapStateXmrLockInMempool;
};

export default function XmrLockTxInMempoolPage({
  state,
}: XmrLockTxInMempoolPageProps) {
  const additionalText = `Confirmations: ${state.aliceXmrLockTxConfirmations}/10`;

  return (
    <Box>
      <DialogContentText>
        The swap provider has published its Monero lock transaction. The swap
        will proceed once the transaction has been confirmed.
      </DialogContentText>

      <MoneroTransactionInfoBox
        title="Monero Lock Transaction"
        txId={state.aliceXmrLockTxId}
        additionalText={additionalText}
        loading
      />
    </Box>
  );
}
