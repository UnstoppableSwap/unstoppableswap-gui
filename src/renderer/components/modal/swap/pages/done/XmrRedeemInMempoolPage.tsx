import { Box, DialogContentText } from '@material-ui/core';
import { SwapStateXmrRedeemInMempool } from 'models/storeModel';
import { useActiveSwapInfo } from 'store/hooks';
import { getSwapXmrAmount } from 'models/rpcModel';
import MoneroTransactionInfoBox from '../../MoneroTransactionInfoBox';
import FeedbackInfoBox from '../../../../pages/help/FeedbackInfoBox';
import { MoneroAmount } from 'renderer/components/other/Units';

type XmrRedeemInMempoolPageProps = {
  state: SwapStateXmrRedeemInMempool | null;
};

export default function XmrRedeemInMempoolPage({
  state,
}: XmrRedeemInMempoolPageProps) {
  const swap = useActiveSwapInfo();
  const additionalContent = swap ? (
    <>
      This transaction transfers{' '}
      <MoneroAmount amount={getSwapXmrAmount(swap)} /> to the{' '}
      {state?.bobXmrRedeemAddress}
    </>
  ) : null;

  return (
    <Box>
      <DialogContentText>
        The swap was successful and the Monero has been sent to the address you
        specified. The swap is completed and you may exit the application now.
      </DialogContentText>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {state && (
          <>
            <MoneroTransactionInfoBox
              title="Monero Redeem Transaction"
              txId={state.bobXmrRedeemTxId}
              additionalContent={additionalContent}
              loading={false}
            />
          </>
        )}
        <FeedbackInfoBox />
      </Box>
    </Box>
  );
}
