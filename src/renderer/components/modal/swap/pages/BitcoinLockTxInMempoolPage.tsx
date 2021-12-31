import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateBtcLockInMempool } from '../../../../../models/storeModel';
import BitcoinIcon from '../../../icons/BitcoinIcon';
import { isTestnet } from '../../../../../store/config';
import { getBitcoinTxExplorerUrl } from '../../../../../utils/currencyUtils';
import TransactionInfoBox from '../TransactionInfoBox';

type BitcoinLockTxInMempoolPageProps = {
  state: SwapStateBtcLockInMempool;
};

export default function BitcoinLockTxInMempoolPage({
  state,
}: BitcoinLockTxInMempoolPageProps) {
  const explorerUrl = getBitcoinTxExplorerUrl(
    state.bobBtcLockTxId,
    isTestnet()
  );

  return (
    <Box>
      <DialogContentText>
        The Bitcoin lock transaction has been published. The swap will proceed
        once the transaction is confirmed and the swap provider locks their
        Monero.
      </DialogContentText>
      <TransactionInfoBox
        title="BTC Lock Transaction"
        txId={state.bobBtcLockTxId}
        explorerUrl={explorerUrl}
        icon={<BitcoinIcon />}
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
