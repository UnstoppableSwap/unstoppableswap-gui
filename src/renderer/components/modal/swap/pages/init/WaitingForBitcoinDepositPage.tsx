import {
  Box,
  Button,
  DialogContentText,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { clipboard } from 'electron';
import BitcoinIcon from 'renderer/components/icons/BitcoinIcon';
import { SwapStateWaitingForBtcDeposit } from '../../../../../../models/storeModel';

const useStyles = makeStyles((theme) => ({
  depositAddressOuter: {
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  depositAddress: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(0.25),
    '-webkit-user-select': 'text',
  },
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

  function handleDepositAddressCopy() {
    clipboard.writeText(state.depositAddress);
  }

  // TODO: Account for BTC lock tx fees
  return (
    <Box>
      <DialogContentText>
        The swap will start automatically as soon as you transfer the minimum
        amount of Bitcoin to the address below. The funds will be used in their
        entirety.
      </DialogContentText>

      <Paper variant="outlined" className={classes.depositAddressOuter}>
        <Typography variant="subtitle1">Bitcoin Deposit Address</Typography>
        <Box className={classes.depositAddress}>
          <BitcoinIcon />
          <Typography variant="h5" className={classes.depositAddress}>
            {state.depositAddress}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          endIcon={<FileCopyOutlinedIcon />}
          onClick={handleDepositAddressCopy}
          size="large"
        >
          Copy
        </Button>
        <Typography variant="subtitle2" className={classes.depositStatusText}>
          Send any amount between {state.minimumAmount} BTC and{' '}
          {state.maximumAmount} BTC. You have deposited enough Bitcoin to swap{' '}
          {state.maxGiveable} BTC
        </Typography>
      </Paper>
    </Box>
  );
}
