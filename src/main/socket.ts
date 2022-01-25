import { io } from 'socket.io-client';
import { ExtendedProvider } from 'models/storeModel';
import { store } from '../store/store';
import { setProviders } from '../store/features/providersSlice';

export default function initSocket() {
  const socket = io('https://api.unstoppableswap.net', {
    path: '/api/socket.io',
  });

  socket.on('provider-refresh', (providerList: ExtendedProvider[]) => {
    store.dispatch(setProviders(providerList));
  });
  console.log(
    `Connected to UnstoppableSwap API websocket at ${socket.io.opts.hostname} (${socket.io.opts.path})`
  );
}
