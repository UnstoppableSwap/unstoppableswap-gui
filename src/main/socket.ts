import { io, Socket } from 'socket.io-client';
import { app } from 'electron';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { SocksProxy } from 'socks';
import { ExtendedProviderStatus, Provider } from '../models/apiModel';
import logger from '../utils/logger';
import { sendSnackbarAlertToRenderer } from './main';
import { store } from './store/mainStore';
import {
  increaseFailedRegistryReconnectAttemptsSinceLastSuccess,
  setRegistryProviders,
} from '../store/features/providersSlice';

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

let globalSocket:
  | [Socket<ServerToClientEvents, ClientToServerEvents>, SocksProxy | null]
  | null = null;

function getSocket(): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null {
  return globalSocket ? globalSocket[0] : null;
}

function getSocketProxyInUse(): SocksProxy | null {
  return globalSocket ? globalSocket[1] : null;
}

function getAgent(): SocksProxyAgent | false {
  const state = store.getState();
  const { proxyStatus } = state.tor;

  if (proxyStatus && proxyStatus.bootstrapped) {
    logger.debug(
      {
        proxyHostname: proxyStatus.proxyHostname,
        proxyPort: proxyStatus.proxyPort,
      },
      'Using Tor as a SOCKS proxy for the UnstoppableSwap Socket API'
    );
    return new SocksProxyAgent(
      `socks5://${proxyStatus.proxyHostname}:${proxyStatus.proxyPort}`
    );
  }

  return false;
}

export default function initSocket() {
  if (globalSocket !== null && globalSocket[0].connected) {
    logger.warn(
      'Skipping UnstoppableSwap Socket initialization because we already have a running socket that is connected'
    );
    return;
  }

  let connectionErrorsDisplayedToUser: string[] = [];

  const agent = getAgent();
  const socket = io(
    process.env.OVERWRITE_API_ADDRESS || 'https://api.unstoppableswap.net',
    {
      path: '/api/socket.io',
      auth: {
        version: app.getVersion(),
      },
      // We need to do this because for some reason the typedef of agent here is string and not https.Agent
      agent: agent as unknown as string,
    }
  );

  globalSocket = [socket, agent === false ? null : agent.proxy];

  logger.debug(
    {
      host: socket.io.opts.hostname,
      path: socket.io.opts.path,
      agent,
    },
    `Connecting to UnstoppableSwap Socket API`
  );

  socket.on('connect', () => {
    logger.info(
      {
        host: socket.io.opts.hostname,
        path: socket.io.opts.path,
      },
      `Connected to UnstoppableSwap Socket API`
    );

    connectionErrorsDisplayedToUser = [];
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
    store.dispatch(increaseFailedRegistryReconnectAttemptsSinceLastSuccess());

    logger.error(
      {
        host: socket.io.opts.hostname,
        path: socket.io.opts.path,
        err,
      },
      `Failed to connect to UnstoppableSwap Socket API`
    );

    const errMessage = err.message;
    if (!connectionErrorsDisplayedToUser.includes(errMessage)) {
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
    store.dispatch(setRegistryProviders(providerList));
  });

  const unsubscribeFromStore = store.subscribe(() => {
    function reconnect() {
      unsubscribeFromStore();
      socket.disconnect();
      globalSocket = null;
      initSocket();
    }

    // Check if we have a global socket
    // Also check if the global socket is the same as the socket this subscription is running on
    if (globalSocket !== null && getSocket() === socket) {
      const state = store.getState();
      const availableProxyStatus = state.tor.proxyStatus;
      const socksProxyInUse = getSocketProxyInUse();

      // If we don't have a SOCKS proxy in use but we now have a TOR Socks Proxy, we need to reconnect the socket
      if (
        socksProxyInUse === null &&
        availableProxyStatus !== false &&
        availableProxyStatus.bootstrapped
      ) {
        logger.info(
          'Detected that the Tor SOCKS proxy is now available, reconnecting the UnstoppableSwap Socket API'
        );
        return reconnect();
      }

      // We have a SOCKS proxy in use but it is no longer available
      if (socksProxyInUse !== null && availableProxyStatus === false) {
        logger.info(
          'Detected that the Tor SOCKS proxy is no longer available, reconnecting the UnstoppableSwap Socket API'
        );
        return reconnect();
      }

      // We have a SOCKS proxy in use and we also have one available
      if (
        socksProxyInUse !== null &&
        availableProxyStatus !== false &&
        availableProxyStatus.bootstrapped
      ) {
        // Check if the SOCKS proxy in use is different from the one we have in the store
        // If the SOCKS proxy in use is different from the one we have in the store, we need to reconnect the socket
        if (
          socksProxyInUse.host !== availableProxyStatus.proxyHostname ||
          socksProxyInUse.port !== availableProxyStatus.proxyPort
        ) {
          logger.info(
            { socksProxyInUse, proxyStatus: availableProxyStatus },
            'Detected that the Tor SOCKS proxy has changed or has become available, reconnecting the UnstoppableSwap Socket API'
          );
          return reconnect();
        }
      }
    }
  });
}

export function transmitReceivedQuoteFromProvider(
  provider: Provider,
  priceBtc: number,
  minimumAmountBtc: number,
  maximumAmountBtc: number
) {
  if (!getSocket()) {
    // We only transmit the quote if we have a socket TOR connection
    // We do not want to expose the identity of the user if they are not using TOR
    return;
  }

  getSocket()?.emit(
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
  if (!getSocket()) {
    // We only transmit the swap details if we have a socket TOR connection
    // We do not want to expose the identity of the user if they are not using TOR
    return;
  }

  getSocket()?.emit(
    'swap-details-updated',
    swapIdHash,
    provider,
    amount,
    stateType,
    firstEnteredDate
  );
}
