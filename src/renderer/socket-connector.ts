import { io } from 'socket.io-client';
import { store } from '../store/store';
import { setProviders } from '../store/features/swap/providersSlice';
import useStore from './store';

export default async () => {
  const socket = io('https://unstoppableswap.net', {
    path: '/api/socket.io',
  });
  socket.on('provider-refresh', (providerList) => {
    store.dispatch(setProviders(providerList));
  });
  socket.on('provider-refresh', useStore.getState().setProviderList);
};
