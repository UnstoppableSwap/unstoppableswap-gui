export const isTestnet = () =>
  process.env.TESTNET?.toString().toLowerCase() === 'true';

export const isExternalRpc = () =>
  process.env.USE_EXTERNAL_RPC?.toString().toLowerCase() === 'true';

export const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

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
