import {
  extractAmountFromUnitString,
  extractBtcBalanceFromBalanceString,
} from '../../utils/parseUtils';

test('should parse btc amount string correctly', () => {
  expect(extractAmountFromUnitString('0.1 BTC')).toBe(0.1);
  expect(extractAmountFromUnitString('0.0045 BTC')).toBe(0.0045);
});

test('should parse xmr amount string correctly', () => {
  expect(extractAmountFromUnitString('0.1 XMR')).toBe(0.1);
  expect(extractAmountFromUnitString('0.0045 XMR')).toBe(0.0045);
});

test('should return null when parsing btc amount with invalid string', () => {
  expect(extractAmountFromUnitString('0.1')).toBeNull();
  expect(extractAmountFromUnitString('BTC')).toBeNull();
  expect(extractAmountFromUnitString('')).toBeNull();
  expect(extractAmountFromUnitString(null as unknown as string)).toBeNull();
  expect(
    extractAmountFromUnitString(undefined as unknown as string)
  ).toBeNull();
});

test('should parse balance stdout string correctly', () => {
  expect(
    extractBtcBalanceFromBalanceString('Bitcoin balance is 0.00000000 BTC')
  ).toBe(0);
  expect(
    extractBtcBalanceFromBalanceString('Bitcoin balance is 0.10450000 BTC')
  ).toBe(0.1045);
});

test('should return null when parsing balance stdout with invalid string', () => {
  expect(extractBtcBalanceFromBalanceString('Bitcoin balance is')).toBeNull();
  expect(extractBtcBalanceFromBalanceString('ABCD')).toBeNull();
  expect(extractBtcBalanceFromBalanceString('')).toBeNull();
  expect(
    extractBtcBalanceFromBalanceString(null as unknown as string)
  ).toBeNull();
  expect(
    extractBtcBalanceFromBalanceString(undefined as unknown as string)
  ).toBeNull();
});
