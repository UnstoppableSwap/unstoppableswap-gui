import { io } from 'socket.io-client';
import { store } from '../store/store';
import { setProviders } from '../store/features/swap/providersSlice';

export default async () => {
  const socket = io('https://api.unstoppableswap.net', {
    path: '/api/socket.io',
  });
  socket.on('provider-refresh', (providerList) => {
    store.dispatch(setProviders(providerList));
  });
};
