import { useState } from 'react';
import { Box, makeStyles, TextField, Typography } from '@material-ui/core';
import { SwapStateWaitingForBtcDeposit } from '../../../../../../models/storeModel';

const MONERO_FEE = 0.000016;

const useStyles = makeStyles((theme) => ({
  outer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  textField: {
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
    },
    '& input[type=number]': {
      MozAppearance: 'textfield',
    },
    maxWidth: theme.spacing(16),
  },
}));

export default function DepositAmountHelper({
  state,
}: {
  state: SwapStateWaitingForBtcDeposit;
}) {
  const classes = useStyles();
  const [amount, setAmount] = useState(state.minDeposit);

  function hasError() {
    if (amount < state.minDeposit || amount > state.maximumAmount) {
      return true;
    }
    return false;
  }

  function calcXMRAmount() {
    if (Number.isNaN(amount)) return '?';
    if (hasError()) return '?';
    if (state.price == null) return '?';

    const fees = state.minDeposit - state.minimumAmount;
    return ((amount - fees) / state.price - MONERO_FEE).toFixed(4);
  }

  return (
    <Box className={classes.outer}>
      <Typography variant="subtitle2">Depositing</Typography>
      <TextField
        error={hasError()}
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        size="small"
        type="number"
        className={classes.textField}
      />
      <Typography variant="subtitle2">
        BTC will give you approximately {calcXMRAmount()} XMR.
      </Typography>
    </Box>
  );
}
