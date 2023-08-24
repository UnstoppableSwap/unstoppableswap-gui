import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateBtcRefunded } from 'models/storeModel';
import BitcoinTransactionInfoBox from '../../BitcoinTransactionInfoBox';
import { useActiveSwapInfo } from '../../../../../../store/hooks';
import { getSwapRefundAddress } from '../../../../../../models/databaseModel';
import FeedbackInfoBox from '../../../../pages/help/FeedbackInfoBox';

export default function BitcoinRefundedPage({
  state,
}: {
  state: SwapStateBtcRefunded | null;
}) {
  const swap = useActiveSwapInfo();
  const additionalContent = swap
    ? `Refund address: ${getSwapRefundAddress(swap)}`
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
      <FeedbackInfoBox />
    </Box>
  );
}
