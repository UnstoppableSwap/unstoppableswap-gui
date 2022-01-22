import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateXmrRedeemInMempool } from '../../../../../../models/storeModel';
import { pionerosToXmr } from '../../../../../../utils/currencyUtils';
import { useActiveDbState } from '../../../../../../store/hooks';
import MoneroTransactionInfoBox from '../../transaction/MoneroTransactionInfoBox';

type XmrRedeemInMempoolPageProps = {
  state: SwapStateXmrRedeemInMempool | null;
};

export default function XmrRedeemInMempoolPage({
  state,
}: XmrRedeemInMempoolPageProps) {
  const xmrAmount = useActiveDbState()?.state.Bob.ExecutionSetupDone.state2.xmr;
  const additionalText = xmrAmount
    ? `This transaction transfers ${pionerosToXmr(xmrAmount).toFixed(
        6
      )} XMR to ${state?.bobXmrRedeemAddress}`
    : null;

  return (
    <Box>
      <DialogContentText>
        The moneroj has been sent to your redeem address. You may exit the
        application now.
      </DialogContentText>
      {state && (
        <MoneroTransactionInfoBox
          title="Monero Redeem Transaction"
          txId={state.bobXmrRedeemTxId}
          additionalText={additionalText}
          loading={false}
        />
      )}
    </Box>
  );
}
