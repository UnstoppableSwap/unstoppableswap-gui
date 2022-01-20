import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateBtcRefunded } from 'models/storeModel';
import BitcoinTransactionInfoBox from '../../transaction/BitcoinTransactionInfoBox';
import { useActiveDbState } from '../../../../../../store/hooks';

export default function BitcoinRefundedPage({
  state,
}: {
  state: SwapStateBtcRefunded | null;
}) {
  const refundAddress =
    useActiveDbState()?.state.Bob.ExecutionSetupDone.state2.refund_address;
  const additionalText = refundAddress
    ? `Refund address: ${refundAddress}`
    : null;

  return (
    <Box>
      <DialogContentText>
        Unfortunately the swap was not successful. The Bitcoin refund
        transaction has been published. All Bitcoin have been refunded to the
        Bitcoin address you provided. You may exit the application now.
      </DialogContentText>
      {state && (
        <BitcoinTransactionInfoBox
          title="BTC Refund Transaction"
          txId={state.bobBtcRefundTxId}
          loading={false}
          additionalText={additionalText}
        />
      )}
    </Box>
  );
}
