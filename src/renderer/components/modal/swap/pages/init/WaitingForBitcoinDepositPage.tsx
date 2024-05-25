import { Box, makeStyles, Typography } from '@material-ui/core';
import { SwapStateWaitingForBtcDeposit } from '../../../../../../models/storeModel';
import DepositAddressInfoBox from '../../DepositAddressInfoBox';
import BitcoinIcon from '../../../../icons/BitcoinIcon';
import { btcToSats, satsToBtc } from '../../../../../../utils/conversionUtils';
import DepositAmountHelper from './DepositAmountHelper';
import { useAppSelector } from '../../../../../../store/hooks';
import {
  BitcoinAmount,
  MoneroBitcoinExchangeRate,
  SatsAmount,
} from '../../../../other/Units';

const useStyles = makeStyles((theme) => ({
  amountHelper: {
    display: 'flex',
    alignItems: 'center',
  },
  additionalContent: {
    paddingTop: theme.spacing(1),
    gap: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
  },
}));

type WaitingForBtcDepositPageProps = {
  state: SwapStateWaitingForBtcDeposit;
};

export default function WaitingForBtcDepositPage({
  state,
}: WaitingForBtcDepositPageProps) {
  const classes = useStyles();
  const bitcoinBalance = useAppSelector((s) => s.rpc.state.balance) || 0;

  // Convert to integer for accurate arithmetic operations
  const fees = satsToBtc(
    btcToSats(state.minDeposit) -
      btcToSats(state.minimumAmount) +
      bitcoinBalance
  );

  // TODO: Account for BTC lock tx fees
  return (
    <Box>
      <DepositAddressInfoBox
        title="Bitcoin Deposit Address"
        address={state.depositAddress}
        additionalContent={
          <Box className={classes.additionalContent}>
            <Typography variant="subtitle2">
              <ul>
                {bitcoinBalance > 0 ? (
                  <li>
                    You have already deposited{' '}
                    <SatsAmount amount={bitcoinBalance} />
                  </li>
                ) : null}
                <li>
                  Send any amount between{' '}
                  <BitcoinAmount amount={state.minDeposit} /> and{' '}
                  <BitcoinAmount
                    amount={state.maximumAmount - satsToBtc(bitcoinBalance)}
                  />
                  to the address above{' '}
                  {bitcoinBalance > 0 && (
                    <>(on top of the already deposited funds)</>
                  )}
                </li>
                <li>
                  All Bitcoin sent to this this address will converted into
                  Monero at an exchance rate of{' '}
                  <MoneroBitcoinExchangeRate rate={state.price} />
                </li>
                <li>
                  The network fee of{' '}
                  <BitcoinAmount amount={fees >= 0 ? fees : null} /> will
                  automatically be deducted from the deposited coins
                </li>
                <li>
                  The swap will start automatically as soon as the minimum
                  amount is deposited
                </li>
              </ul>
            </Typography>
            <DepositAmountHelper btcFees={fees} state={state} />
          </Box>
        }
        icon={<BitcoinIcon />}
      />
    </Box>
  );
}
