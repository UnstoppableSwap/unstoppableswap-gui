import {
  Box,
  DialogContentText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { SwapStateWaitingForBtcDeposit } from '../../../../../../models/storeModel';
import DepositAddressInfoBox from '../../DepositAddressInfoBox';
import BitcoinIcon from '../../../../icons/BitcoinIcon';
import { btcToSats, satsToBtc } from '../../../../../../utils/conversionUtils';
import DepositAmountHelper from './DepositAmountHelper';

const useStyles = makeStyles((theme) => ({
  depositStatusText: {
    paddingTop: theme.spacing(0.5),
  },
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

  // Convert to integer for accurate arithmetic operations
  const fees = parseFloat(
    satsToBtc(
      btcToSats(state.minDeposit) - btcToSats(state.minimumAmount)
    ).toFixed(8)
  );

  // TODO: Account for BTC lock tx fees
  return (
    <Box>
      <DialogContentText>
        The swap will start automatically as soon as you transfer the minimum
        amount of Bitcoin to the address below. The funds will be used in their
        entirety.
      </DialogContentText>

      <DepositAddressInfoBox
        title="Bitcoin Deposit Address"
        address={state.depositAddress}
        additionalContent={
          <Box className={classes.additionalContent}>
            <Typography
              variant="subtitle2"
              className={classes.depositStatusText}
            >
              Send any amount between {state.minDeposit} BTC and{' '}
              {state.maximumAmount} BTC to the address above. All Bitcoin sent
              to this this address will converted into Monero at an exchance
              rate of {state.price || 'unknown'} BTC/XMR. The network fee of{' '}
              {fees} BTC will automatically be deducted from the deposited
              coins. You have deposited enough Bitcoin to swap{' '}
              {state.maxGiveable} BTC.
            </Typography>
            <DepositAmountHelper state={state} />
          </Box>
        }
        icon={<BitcoinIcon />}
      />
    </Box>
  );
}
