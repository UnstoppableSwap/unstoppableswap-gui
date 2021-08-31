import { io } from 'socket.io-client';
import useStore from './store';

export default async () => {
  const socket = io('https://unstoppableswap.net', {
    path: '/api/socket.io',
  });
  socket.on('provider-refresh', useStore.getState().setProviderList);
};
