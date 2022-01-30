import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { useState } from 'react';
import SendIcon from '@material-ui/icons/Send';
import { useAppSelector } from '../../../../store/hooks';
import BitcoinIcon from '../../icons/BitcoinIcon';
import WithdrawDialog from '../../modal/wallet/WithdrawDialog';
import WalletRefreshButton from './WalletRefreshButton';
import { isWithdrawState } from '../../../../models/storeModel';
import InfoBox from '../../modal/swap/transaction/InfoBox';

const useStyles = makeStyles((theme) => ({
  title: {
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(0.5),
  },
}));

export default function WithdrawWidget() {
  const classes = useStyles();
  const walletBalance = useAppSelector((state) => state.balance.balanceValue);
  const checkingBalance = useAppSelector(
    (state) => state.balance.processRunning
  );

  const forceShowDialog = useAppSelector((s) =>
    isWithdrawState(s.withdraw.state)
  );
  const [showDialog, setShowDialog] = useState(false);

  function onShowDialog() {
    setShowDialog(true);
  }

  return (
    <>
      <InfoBox
        title={
          <Box className={classes.title}>
            Wallet Balance
            <WalletRefreshButton />
          </Box>
        }
        mainContent={
          <Typography variant="h5">
            {walletBalance === null ? '?' : walletBalance} BTC
          </Typography>
        }
        icon={<BitcoinIcon />}
        additionalContent={
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            size="large"
            onClick={onShowDialog}
            disabled={
              walletBalance === null || checkingBalance || walletBalance <= 0
            }
          >
            Withdraw
          </Button>
        }
        loading={false}
      />
      <WithdrawDialog
        open={showDialog || forceShowDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
}
