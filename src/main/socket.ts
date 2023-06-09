import { io, Socket } from 'socket.io-client';
import { app } from 'electron';
import { ExtendedProviderStatus, Provider } from '../models/apiModel';
import logger from '../utils/logger';
import { sendSnackbarAlertToRenderer } from './main';
import { store } from '../store/store';
import { setProviders } from '../store/features/providersSlice';

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
  let connectionErrorsDisplayedToUser: string[] = [];

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

  socket.on('connect', () => {
    logger.info(
      {
        host: socket.io.opts.hostname,
        path: socket.io.opts.path,
      },
      `Connected to UnstoppableSwap Socket API`
    );

    connectionErrorsDisplayedToUser = [];

    sendSnackbarAlertToRenderer(
      "Connected to public registry",
      'info',
      2000,
      null,
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

    const errMessage = err.message;
    if(!connectionErrorsDisplayedToUser.includes(errMessage)) {
      sendSnackbarAlertToRenderer(
        `Failed to connect to public registry (${errMessage})`,
        'error',
        10000,
        `${err.message}`
      );

      connectionErrorsDisplayedToUser.push(errMessage);
    }
  });

  socket.on('provider-refresh', (providerList: ExtendedProviderStatus[]) => {
    store.dispatch(setProviders(providerList));
  });
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
