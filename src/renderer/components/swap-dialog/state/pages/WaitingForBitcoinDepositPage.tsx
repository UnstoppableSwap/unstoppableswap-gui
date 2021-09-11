import { Box, Button, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { clipboard } from 'electron';
import { SwapStateWaitingForBtcDeposit } from '../../../../../swap/swap-state-machine';

const useStyles = makeStyles((theme) => ({
  depositAddressOuter: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    verticalAlign: 'baseline',
  },
}));

type WaitingForBitcoinDepositPageProps = {
  state: SwapStateWaitingForBtcDeposit;
};

export default function WaitingForBitcoinDepositPage({
  state,
}: WaitingForBitcoinDepositPageProps) {
  const classes = useStyles();

  function handleDepositAddressCopy() {
    clipboard.writeText(state.depositAddress);
  }

  return (
    <Box>
      <Typography variant="h5">
        Please deposit the Bitcoin you want to swap to the following address
      </Typography>
      <Paper variant="outlined" className={classes.depositAddressOuter}>
        <Typography variant="h6">{state.depositAddress}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FileCopyOutlinedIcon />}
          onClick={handleDepositAddressCopy}
        >
          Copy
        </Button>
      </Paper>
      <Typography variant="body1">Max giveable: {state.maxGiveable}</Typography>
    </Box>
  );
}
