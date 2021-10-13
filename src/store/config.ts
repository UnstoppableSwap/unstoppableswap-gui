// eslint-disable-next-line import/prefer-default-export
export const isTestnet = () =>
  process.env.TESTNET?.toString().toLowerCase() === 'true';
