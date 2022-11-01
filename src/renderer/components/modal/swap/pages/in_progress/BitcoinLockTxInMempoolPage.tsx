import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateBtcLockInMempool } from '../../../../../../models/storeModel';
import BitcoinTransactionInfoBox from '../../BitcoinTransactionInfoBox';
import {
  useActiveDbState,
  useMaxTxLockConfirmationsActiveSwap,
} from '../../../../../../store/hooks';
import SwapMightBeCancelledAlert from '../../../../alert/SwapMightBeCancelledAlert';

type BitcoinLockTxInMempoolPageProps = {
  state: SwapStateBtcLockInMempool;
};

export default function BitcoinLockTxInMempoolPage({
  state,
}: BitcoinLockTxInMempoolPageProps) {
  const dbState = useActiveDbState();
  const maxTxLockConfirmations = useMaxTxLockConfirmationsActiveSwap();

  return (
    <Box>
      {dbState && maxTxLockConfirmations != null && (
        <SwapMightBeCancelledAlert
          dbState={dbState}
          bobBtcLockTxConfirmations={maxTxLockConfirmations}
        />
      )}
      <DialogContentText>
        The Bitcoin lock transaction has been published. The swap will proceed
        once the transaction is confirmed and the swap provider locks their
        Monero.
      </DialogContentText>
      <BitcoinTransactionInfoBox
        title="Bitcoin Lock Transaction"
        txId={state.bobBtcLockTxId}
        loading
        additionalContent={
          <>
            Most swap providers require 2 confirmations
            <br />
            Confirmations: {maxTxLockConfirmations}
          </>
        }
      />
    </Box>
  );
}
