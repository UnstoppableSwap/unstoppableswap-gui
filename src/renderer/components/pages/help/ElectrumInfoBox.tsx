import { Typography } from '@material-ui/core';
import InfoBox from '../../modal/swap/InfoBox';
import BitcoinIcon from '../../icons/BitcoinIcon';
import { useAppSelector } from '../../../../store/hooks';

export default function ElectrumInfoBox() {
  const electrumServerConnection = useAppSelector((s) => s.electrum.connection);
  const numberOfTrackedTransactions = useAppSelector(
    (s) => s.electrum.txs.length
  );

  return (
    <InfoBox
      title="Bitcoin Electrum Server"
      mainContent={
        <Typography variant="subtitle2">
          The GUI connects to a Bitcoin Electrum Server to retrieve Blockchain
          data to display some additional information about the state of your
          swaps
        </Typography>
      }
      additionalContent={
        electrumServerConnection ? (
          <Typography variant="subtitle2">
            Connected to {electrumServerConnection[1]} on port{' '}
            {electrumServerConnection[2]} over {electrumServerConnection[3]}. We
            are currently watching {numberOfTrackedTransactions} transactions.
          </Typography>
        ) : (
          <Typography variant="subtitle2">
            Not connected to any Electrum Server. We are trying to connect to
            one...
          </Typography>
        )
      }
      icon={<BitcoinIcon />}
      loading={electrumServerConnection === null}
    />
  );
}
