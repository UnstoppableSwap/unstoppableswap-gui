import { makeStyles, Box, Typography, Chip } from '@material-ui/core';
import { satsToBtc, secondsToDays } from '../../../../utils/conversionUtils';
import { ExtendedProviderStatus } from '../../../../models/apiModel';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    '& *': {
      lineBreak: 'anywhere',
    },
  },
  chipsOuter: {
    display: 'flex',
    marginTop: theme.spacing(1),
    gap: theme.spacing(0.5),
  },
}));

export default function ProviderInfo({
  provider,
}: {
  provider: ExtendedProviderStatus;
}) {
  const classes = useStyles();

  return (
    <Box className={classes.content}>
      <Typography color="textSecondary" gutterBottom>
        Swap Provider
      </Typography>
      <Typography variant="h5" component="h2">
        {provider.multiAddr}
      </Typography>
      <Typography color="textSecondary" gutterBottom>
        {provider.peerId.substring(0, 8)}...{provider.peerId.slice(-8)}
      </Typography>
      <Typography variant="caption">
        Exchange rate: {satsToBtc(provider.price)} BTC/XMR
        <br />
        Minimum swap amount: {satsToBtc(provider.minSwapAmount)} BTC
        <br />
        Maximum swap amount: {satsToBtc(provider.maxSwapAmount)} BTC
      </Typography>
      <Box className={classes.chipsOuter}>
        <Chip label={provider.testnet ? 'Testnet' : 'Mainnet'} />
        {provider.uptime && (
          <Chip label={`${Math.round(provider.uptime * 100)} % uptime`} />
        )}
        {provider.age ? (
          <Chip
            label={`Went online ${Math.round(secondsToDays(provider.age))} ${
              provider.age === 1 ? 'day' : 'days'
            } ago`}
          />
        ) : (
          <Chip label="Discovered via rendezvous point" />
        )}
      </Box>
    </Box>
  );
}
