import {
  Box,
  DialogContentText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { SwapStateWaitingForBtcDeposit } from '../../../../../../models/storeModel';
import DepositAddressInfoBox from '../../transaction/DepositAddressInfoBox';
import BitcoinIcon from '../../../../icons/BitcoinIcon';

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
              Send any amount between {state.minimumAmount} BTC (and some more
              for network fees) and {state.maximumAmount} BTC to the address
              above. You have deposited enough Bitcoin to swap{' '}
              {state.maxGiveable} BTC
            </Typography>
          </>
        }
        icon={<BitcoinIcon />}
      />
    </Box>
  );
}
