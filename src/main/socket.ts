import { io } from 'socket.io-client';
import { store } from '../store/store';
import { setProviders } from '../store/features/providersSlice';
import { ExtendedProvider } from '../models/apiModel';
import logger from '../utils/logger';

export default function initSocket() {
  const socket = io('https://asb.unstoppableswap.net', {
    path: '/api/socket.io',
  });

  socket.on('provider-refresh', (providerList: ExtendedProvider[]) => {
    store.dispatch(setProviders(providerList));
  });
  logger.info(
    {
      host: socket.io.opts.hostname,
      path: socket.io.opts.path,
    },
    `Connected to UnstoppableSwap API`
  );
}
