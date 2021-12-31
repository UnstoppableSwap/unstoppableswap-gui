import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateXmrRedeemInMempool } from '../../../../../models/storeModel';
import { isTestnet } from '../../../../../store/config';
import {
  getMoneroTxExplorerUrl,
  pionerosToXmr,
} from '../../../../../utils/currencyUtils';
import TransactionInfoBox from '../TransactionInfoBox';
import MoneroIcon from '../../../icons/MoneroIcon';
import { useActiveDbState } from '../../../../../store/hooks';

type XmrRedeemInMempoolPageProps = {
  state: SwapStateXmrRedeemInMempool;
};

export default function XmrRedeemInMempoolPage({
  state,
}: XmrRedeemInMempoolPageProps) {
  const explorerUrl = getMoneroTxExplorerUrl(
    state.bobXmrRedeemTxId,
    isTestnet()
  );
  const xmrAmount = useActiveDbState()?.state.Bob.ExecutionSetupDone.state2.xmr;
  const additionalText = xmrAmount
    ? `This transaction transfers ${pionerosToXmr(xmrAmount).toFixed(
        6
      )} XMR to ${state.bobXmrRedeemAddress}`
    : null;

  return (
    <Box>
      <DialogContentText>
        The moneroj has been sent to your redeem address. You may exit the
        application now.
      </DialogContentText>
      <TransactionInfoBox
        title="Monero Redeem Transaction"
        explorerUrl={explorerUrl}
        icon={<MoneroIcon />}
        txId={state.bobXmrRedeemTxId}
        additionalText={additionalText}
        loading={false}
      />
    </Box>
  );
}
