import { useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { useSnackbar } from 'notistack';

export default function ListSellersSnackbar() {
  const { enqueueSnackbar } = useSnackbar();

  const message = useAppSelector<string | null>((state) => {
    if (
      state.listSellers.processRunning ||
      state.listSellers.exitCode === null
    ) {
      return null;
    }
    if (state.listSellers.exitCode === 0) {
      const amountOfSellers = state.listSellers.sellers.length;
      const amountOfYetUnknownSellers = state.listSellers.sellers.filter(
        (seller) => {
          return (
            (state.providers.providers || []).findIndex(
              (p) =>
                p.peerId === seller.peerId && p.multiAddr === seller.multiAddr
            ) < 0
          );
        }
      ).length;
      if (amountOfSellers === 0) {
        return `No providers were discovered at the rendezvous point`;
      }
      if(amountOfSellers === 1) {
        return `Discovered one provider at the rendezvous point which was ${amountOfYetUnknownSellers > 0 ? 'not yet part of the public registry' : 'already part of the public registry'}`;
      }
      return `Discovered ${amountOfSellers} providers at the rendezvous point. ${amountOfYetUnknownSellers} of which were not yet part of the public registry`;
    }
    return 'Connection to rendezvous point failed';
  });

  useEffect(() => {
    if (message) {
      enqueueSnackbar(message, {
        variant: message.includes('failed') ? 'error' : 'success',
        autoHideDuration: 10000,
      });
    }
  }, [message]);

  return <></>;
}
