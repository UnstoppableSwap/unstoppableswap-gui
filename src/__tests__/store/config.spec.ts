import { isTestnet } from '../../store/config';

test('should detect testnet environment', () => {
  process.env.TESTNET = 'true';
  expect(isTestnet()).toBe(true);

  process.env.TESTNET = 'TRUE';
  expect(isTestnet()).toBe(true);

  process.env.TESTNET = 'false';
  expect(isTestnet()).toBe(false);

  process.env.TESTNET = 'FALSE';
  expect(isTestnet()).toBe(false);

  process.env.TESTNET = undefined;
  expect(isTestnet()).toBe(false);
});
