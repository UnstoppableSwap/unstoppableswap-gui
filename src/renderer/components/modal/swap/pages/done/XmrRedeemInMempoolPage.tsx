import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateXmrRedeemInMempool } from '../../../../../../models/storeModel';
import { pionerosToXmr } from '../../../../../../utils/conversionUtils';
import { useActiveDbState } from '../../../../../../store/hooks';
import MoneroTransactionInfoBox from '../../MoneroTransactionInfoBox';
import FeedbackInfoBox from '../../../../pages/help/FeedbackInfoBox';

type XmrRedeemInMempoolPageProps = {
  state: SwapStateXmrRedeemInMempool | null;
};

export default function XmrRedeemInMempoolPage({
  state,
}: XmrRedeemInMempoolPageProps) {
  const xmrAmount = useActiveDbState()?.state.Bob.ExecutionSetupDone.state2.xmr;
  const additionalContent = xmrAmount
    ? `This transaction transfers ${pionerosToXmr(xmrAmount).toFixed(
        6
      )} XMR to ${state?.bobXmrRedeemAddress}`
    : null;

  return (
    <Box>
      <DialogContentText>
        The swap was successful and the Monero has been sent to the address you
        specified. The swap is completed and you may exit the application now.
      </DialogContentText>
      {state && (
        <>
          <MoneroTransactionInfoBox
            title="Monero Redeem Transaction"
            txId={state.bobXmrRedeemTxId}
            additionalContent={additionalContent}
            loading={false}
          />
          <br />
        </>
      )}
      <FeedbackInfoBox />
    </Box>
  );
}
