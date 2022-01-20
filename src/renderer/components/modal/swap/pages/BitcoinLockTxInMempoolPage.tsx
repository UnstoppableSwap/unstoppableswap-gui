import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateBtcLockInMempool } from '../../../../../models/storeModel';
import BitcoinTransactionInfoBox from '../transaction/BitcoinTransactionInfoBox';

type BitcoinLockTxInMempoolPageProps = {
  state: SwapStateBtcLockInMempool;
};

export default function BitcoinLockTxInMempoolPage({
  state,
}: BitcoinLockTxInMempoolPageProps) {
  return (
    <Box>
      <DialogContentText>
        The Bitcoin lock transaction has been published. The swap will proceed
        once the transaction is confirmed and the swap provider locks their
        Monero.
      </DialogContentText>
      <BitcoinTransactionInfoBox
        title="BTC Lock Transaction"
        txId={state.bobBtcLockTxId}
        loading
        additionalText={
          <>
            Most swap providers require 2 confirmations
            <br />
            Confirmations: {state.bobBtcLockTxConfirmations}
          </>
        }
      />
    </Box>
  );
}
