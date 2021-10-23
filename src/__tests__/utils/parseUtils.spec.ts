import { extractAmountFromUnitString } from '../../utils/parseUtils';

test('should parse btc amount string correctly', () => {
  expect(extractAmountFromUnitString('0.1 BTC')).toBe(0.1);
  expect(extractAmountFromUnitString('0.0045 BTC')).toBe(0.0045);
});

test('should parse xmr amount string correctly', () => {
  expect(extractAmountFromUnitString('0.1 XMR')).toBe(0.1);
  expect(extractAmountFromUnitString('0.0045 XMR')).toBe(0.0045);
});

test('should fail with invalid strings', () => {
  expect(() => extractAmountFromUnitString('0.1')).toThrow();
  expect(() => extractAmountFromUnitString('BTC')).toThrow();
  expect(() => extractAmountFromUnitString('')).toThrow();
  expect(() =>
    extractAmountFromUnitString(null as unknown as string)
  ).toThrow();
  expect(() =>
    extractAmountFromUnitString(undefined as unknown as string)
  ).toThrow();
});
