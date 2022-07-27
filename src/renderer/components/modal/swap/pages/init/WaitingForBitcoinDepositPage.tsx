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

const useStyles = makeStyles((theme) => ({
  depositStatusText: {
    paddingTop: theme.spacing(0.5),
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
  const fees = satsToBtc(
    btcToSats(state.minDeposit) - btcToSats(state.minimumAmount)
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
          <>
            <Typography
              variant="subtitle2"
              className={classes.depositStatusText}
            >
              Send any amount between {state.minDeposit} BTC and{' '}
              {state.maximumAmount} BTC to the address above. All Bitcoin sent
              to this this address will converted into Monero at an exchance
              rate of {state.price || 'unknown'} BTC/XMR. The network fee of{' '}
              {fees} BTC will automatically be deducted from the deposited
              coins.
            </Typography>
            <Typography variant="subtitle2">
              You have deposited enough Bitcoin to swap {state.maxGiveable} BTC
            </Typography>
          </>
        }
        icon={<BitcoinIcon />}
      />
    </Box>
  );
}
