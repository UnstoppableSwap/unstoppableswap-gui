import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useAppSelector } from '../../../store/hooks';
import { isCliLogFetchedPeerStatus } from '../../../models/cliModel';

export default function ListSellersSnackbar() {
  const { enqueueSnackbar } = useSnackbar();

  const message = useAppSelector<string | null>((state) => {
    if (
      state.providers.rendezvous.processRunning ||
      state.providers.rendezvous.exitCode === null
    ) {
      return null;
    }
    if (state.providers.rendezvous.exitCode === 0) {
      const amountOfSellers = state.providers.rendezvous.logs.filter(
        isCliLogFetchedPeerStatus
      ).length;

      if (amountOfSellers === 0) {
        return `No providers were discovered at the rendezvous point`;
      }
      if (amountOfSellers === 1) {
        return `Discovered one provider at the rendezvous point`;
      }
      return `Discovered ${amountOfSellers} providers at the rendezvous point`;
    }
    return 'Connection to rendezvous point failed';
  });

  useEffect(() => {
    if (message) {
      enqueueSnackbar(message, {
        variant: message.includes('failed') ? 'error' : 'success',
        autoHideDuration: 5000,
      });
    }
  }, [message, enqueueSnackbar]);

  return <></>;
}
