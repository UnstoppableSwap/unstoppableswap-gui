import { Box, DialogContentText } from '@material-ui/core';
import React from 'react';
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
  const additionalText = `Confirmations: ${state.aliceXmrLockTxConfirmations}/10`;

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
        additionalText={additionalText}
        icon={<MoneroIcon />}
        loading
      />
    </Box>
  );
}
