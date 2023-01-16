import { io } from 'socket.io-client';
import { store } from '../store/store';
import { setProviders } from '../store/features/providersSlice';
import { ExtendedProviderStatus } from '../models/apiModel';
import logger from '../utils/logger';

export default function initSocket() {
  const socket = io('https://api.unstoppableswap.net', {
    path: '/api/socket.io',
  });

  socket.on('connect', () => {
    logger.info(
      {
        host: socket.io.opts.hostname,
        path: socket.io.opts.path,
      },
      `Connected to UnstoppableSwap Socket API`
    );
  });

  socket.on('disconnect', () => {
    logger.info(
      {
        host: socket.io.opts.hostname,
        path: socket.io.opts.path,
      },
      `Disconnected from UnstoppableSwap Socket API`
    );
  });

  socket.on('connect_error', (err) => {
    logger.error(
      {
        host: socket.io.opts.hostname,
        path: socket.io.opts.path,
        err,
      },
      `Failed to connect to UnstoppableSwap Socket API`
    );
  });

  socket.on('provider-refresh', (providerList: ExtendedProviderStatus[]) => {
    store.dispatch(setProviders(providerList));
  });
}
