import { ChangeEvent, useEffect, useState } from 'react';
import {
  makeStyles,
  Box,
  Paper,
  Typography,
  TextField,
  LinearProgress,
  Fab,
  Button,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import ProviderSelect from '../../modal/provider/ProviderSelect';
import { satsToBtc } from '../../../../utils/conversionUtils';
import ProviderSubmitDialog from '../../modal/provider/ProviderSubmitDialog';
import SwapDialog from '../../modal/swap/SwapDialog';
import { useAppSelector } from '../../../../store/hooks';
import { ExtendedProvider, isSwapState } from '../../../../models/storeModel';

const useStyles = makeStyles((theme) => ({
  inner: {
    width: 'min(480px, 100%)',
    minHeight: '150px',
    display: 'grid',
    padding: theme.spacing(1),
    gridGap: theme.spacing(1),
  },
  header: {
    padding: 0,
  },
  headerText: {
    padding: theme.spacing(1),
  },
  providerInfo: {
    padding: theme.spacing(1),
  },
  swapIconOuter: {
    display: 'flex',
    justifyContent: 'center',
  },
  swapIcon: {
    marginRight: theme.spacing(1),
  },
}));

function Title() {
  const classes = useStyles();

  return (
    <Box className={classes.header}>
      <Typography variant="h5" className={classes.headerText}>
        Swap
      </Typography>
    </Box>
  );
}

function HasProviderSwapWidget({
  selectedProvider,
}: {
  selectedProvider: ExtendedProvider;
}) {
  const classes = useStyles();

  const forceShowDialog = useAppSelector((state) =>
    isSwapState(state.swap.state)
  );
  const [showDialog, setShowDialog] = useState(false);
  const [btcFieldValue, setBtcFieldValue] = useState<number | string>(
    satsToBtc(selectedProvider.minSwapAmount)
  );
  const [xmrFieldValue, setXmrFieldValue] = useState(1);

  function onBtcAmountChange(event: ChangeEvent<HTMLInputElement>) {
    setBtcFieldValue(event.target.value);
  }

  function updateXmrValue() {
    const parsedBtcAmount = Number(btcFieldValue);
    if (Number.isNaN(parsedBtcAmount)) {
      setXmrFieldValue(0);
    } else {
      const convertedXmrAmount =
        parsedBtcAmount / satsToBtc(selectedProvider.price);
      setXmrFieldValue(convertedXmrAmount);
    }
  }

  function getBtcFieldError(): string | null {
    const parsedBtcAmount = Number(btcFieldValue);
    if (Number.isNaN(parsedBtcAmount)) {
      return 'This is not a valid number';
    }
    if (parsedBtcAmount < satsToBtc(selectedProvider.minSwapAmount)) {
      return `The minimum swap amount is ${satsToBtc(
        selectedProvider.minSwapAmount
      )} BTC`;
    }
    if (parsedBtcAmount > satsToBtc(selectedProvider.maxSwapAmount)) {
      return `The maximum swap amount is ${satsToBtc(
        selectedProvider.maxSwapAmount
      )} BTC`;
    }
    return null;
  }

  function handleGuideDialogOpen() {
    if (!getBtcFieldError()) {
      setShowDialog(true);
    }
  }

  useEffect(updateXmrValue, [btcFieldValue, selectedProvider]);

  return (
    // 'elevation' prop can't be passed down (type def issue)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Box className={classes.inner} component={Paper} elevation={5}>
      <Title />
      <TextField
        label="Send"
        size="medium"
        variant="outlined"
        value={btcFieldValue}
        onChange={onBtcAmountChange}
        error={!!getBtcFieldError()}
        helperText={getBtcFieldError()}
        autoFocus
        InputProps={{
          endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
        }}
      />
      <Box className={classes.swapIconOuter}>
        <ArrowDownwardIcon fontSize="small" />
      </Box>
      <TextField
        label="Receive"
        variant="outlined"
        size="medium"
        value={xmrFieldValue.toFixed(6)}
        InputProps={{
          endAdornment: <InputAdornment position="end">XMR</InputAdornment>,
        }}
      />
      <ProviderSelect />
      <Fab
        variant="extended"
        color="primary"
        disabled={!!getBtcFieldError()}
        onClick={handleGuideDialogOpen}
      >
        <SwapHorizIcon className={classes.swapIcon} />
        Swap
      </Fab>
      <SwapDialog
        open={showDialog || forceShowDialog}
        onClose={() => setShowDialog(false)}
      />
    </Box>
  );
}

function HasNoProviderSwapWidget() {
  const classes = useStyles();

  const [showSubmitProviderDialog, setShowSubmitProviderDialog] =
    useState(false);

  return (
    // 'elevation' prop can't be passed down (type def issue)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Box className={classes.inner} component={Paper} elevation={15}>
      <Title />
      <LinearProgress />
      <Button onClick={() => setShowSubmitProviderDialog(true)} size="small">
        Submit swap provider
      </Button>
      <ProviderSubmitDialog
        open={showSubmitProviderDialog}
        onClose={() => setShowSubmitProviderDialog(false)}
      />
    </Box>
  );
}

export default function SwapWidget() {
  const selectedProvider = useAppSelector(
    (state) => state.providers.selectedProvider
  );

  if (selectedProvider) {
    return <HasProviderSwapWidget selectedProvider={selectedProvider} />;
  }
  return <HasNoProviderSwapWidget />;
}
