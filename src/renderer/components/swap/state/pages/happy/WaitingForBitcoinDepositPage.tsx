import { Box, Button, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
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
    '& > *': {
      paddingRight: theme.spacing(0.25),
    },
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

  return (
    <Box>
      <Typography variant="h5" align="center">
        Deposit Bitcoin
      </Typography>
      <Typography variant="subtitle2">
        The exchange will start automatically when the deposit arrives to the
        address specified below
      </Typography>

      <Paper variant="outlined" className={classes.depositAddressOuter}>
        <Typography variant="subtitle1">Deposit Address</Typography>
        <Box className={classes.depositAddress}>
          <BitcoinIcon />
          <Typography variant="h5">{state.depositAddress}</Typography>
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
          Sent any amount between 0.1 BTC and 0.5 BTC. You have deposited{' '}
          {state.maxGiveable} BTC
        </Typography>
      </Paper>
    </Box>
  );
}
