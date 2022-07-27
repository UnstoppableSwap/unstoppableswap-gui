import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateBtcRefunded } from 'models/storeModel';
import BitcoinTransactionInfoBox from '../../BitcoinTransactionInfoBox';
import { useActiveDbState } from '../../../../../../store/hooks';

export default function BitcoinRefundedPage({
  state,
}: {
  state: SwapStateBtcRefunded | null;
}) {
  const refundAddress =
    useActiveDbState()?.state.Bob.ExecutionSetupDone.state2.refund_address;
  const additionalContent = refundAddress
    ? `Refund address: ${refundAddress}`
    : null;

  return (
    <Box>
      <DialogContentText>
        Unfortunately, the swap was unsuccessful and the Bitcoin refund
        transaction was published. All Bitcoin have been refunded to the Bitcoin
        address you specified. The swap is completed and you may exit the
        application now.
      </DialogContentText>
      {state && (
        <BitcoinTransactionInfoBox
          title="Bitcoin Refund Transaction"
          txId={state.bobBtcRefundTxId}
          loading={false}
          additionalContent={additionalContent}
        />
      )}
    </Box>
  );
}
