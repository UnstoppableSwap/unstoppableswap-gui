import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateXmrLockInMempool } from '../../../../../models/storeModel';
import MoneroIcon from '../../../icons/MoneroIcon';
import { isTestnet } from '../../../../../store/config';
import { getMoneroTxExplorerUrl } from '../../../../../utils/currencyUtils';
import TransactionInfoBox from '../TransactionInfoBox';

type XmrLockTxInMempoolPageProps = {
  state: SwapStateXmrLockInMempool;
};

export default function XmrLockTxInMempoolPage({
  state,
}: XmrLockTxInMempoolPageProps) {
  const explorerUrl = getMoneroTxExplorerUrl(
    state.aliceXmrLockTxId,
    isTestnet()
  );
  const estimatedTimeRemainingMin =
    (state.aliceXmrLockTxNeededConfirmations -
      state.aliceXmrLockTxSeenConfirmations) *
    2;

  return (
    <Box>
      <DialogContentText>
        The swap provider has published its Monero lock transaction. The swap
        will proceed once the transaction has been confirmed.
      </DialogContentText>

      <TransactionInfoBox
        title="Monero Lock Transaction"
        txId={state.aliceXmrLockTxId}
        explorerUrl={explorerUrl}
        additionalText={
          <>
            Confirmations: {state.aliceXmrLockTxSeenConfirmations}/
            {state.aliceXmrLockTxNeededConfirmations}
            <br />
            Approximately {estimatedTimeRemainingMin}min remaining until the
            transaction is fully confirmed
          </>
        }
        icon={<MoneroIcon />}
        loading
      />
    </Box>
  );
}
