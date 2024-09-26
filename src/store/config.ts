import { ExtendedProviderStatus } from 'models/apiModel';

export const isTestnet = () =>
  process.env.TESTNET?.toString().toLowerCase() === 'true';

export const isExternalRpc = () =>
  process.env.USE_EXTERNAL_RPC?.toString().toLowerCase() === 'true';

export const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export function getStubTestnetProvider(): ExtendedProviderStatus | null {
  if (
    !isTestnet() ||
    !process.env.STUB_TESTNET_PROVIDER_MULTIADDR ||
    !process.env.STUB_TESTNET_PROVIDER_PEER_ID
  ) {
    return null;
  }

  return {
    multiAddr: process.env.STUB_TESTNET_PROVIDER_MULTIADDR,
    peerId: process.env.STUB_TESTNET_PROVIDER_PEER_ID,
    testnet: true,
    age: 0,
    maxSwapAmount: 10000000,
    minSwapAmount: 100000,
    price: 700000,
    relevancy: 1,
    uptime: 1,
    recommended: true,
  };
}

export const getPlatform = () => {
  switch (process.platform) {
    case 'darwin':
    case 'sunos':
      return 'mac';
    case 'win32':
      return 'win';
    case 'aix':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'android':
      return 'linux';
    default:
      return 'linux';
  }
};

export function getElectrumRpcUrl(): string {
  return process.env.OVERRIDE_ELECTRUM_RPC_URL ?? 'tcp://blockstream.info:110';
}
