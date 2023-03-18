import { io, Socket } from 'socket.io-client';
import { app } from 'electron';
import { store } from '../store/store';
import { setProviders } from '../store/features/providersSlice';
import { ExtendedProviderStatus, Provider } from '../models/apiModel';
import logger from '../utils/logger';

interface ServerToClientEvents {
  'provider-refresh': (list: Provider[]) => void;
}

interface ClientToServerEvents {
  'provider-quote-received': (
    provider: Provider,
    priceBtc: number,
    minimumAmountBtc: number,
    maximumAmountBtc: number
  ) => void;
  'swap-details-updated': (
    swapIdHash: string,
    provider: Provider,
    amount: number,
    stateType: string,
    firstEnteredDate: number
  ) => void;
}

let globalSocket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
  null;

export default function initSocket() {
  const socket = io(
    process.env.OVERWRITE_API_ADDRESS || 'https://api.unstoppableswap.net',
    {
      path: '/api/socket.io',
      auth: {
        version: app.getVersion(),
      },
    }
  );
  globalSocket = socket;

  socket.on('provider-refresh', (providerList: ExtendedProviderStatus[]) => {
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

export function transmitReceivedQuoteFromProvider(
  provider: Provider,
  priceBtc: number,
  minimumAmountBtc: number,
  maximumAmountBtc: number
) {
  globalSocket?.emit(
    'provider-quote-received',
    provider,
    priceBtc,
    minimumAmountBtc,
    maximumAmountBtc
  );
}

export function transmitSwapDetailsUpdated(
  provider: Provider,
  swapIdHash: string,
  amount: number,
  stateType: string,
  firstEnteredDate: number
) {
  globalSocket?.emit(
    'swap-details-updated',
    swapIdHash,
    provider,
    amount,
    stateType,
    firstEnteredDate
  );
}
