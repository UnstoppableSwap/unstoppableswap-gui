import {
  extractAmountFromUnitString,
  parseDateString,
  parseStateString,
} from '../../utils/parseUtils';
import dbStateCancelled from '../mock_db_states/db_state_btc_cancelled.json';

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

test('should parse UTC date string with offset correctly', () => {
  expect(parseDateString('2021-12-29 14:25:59.64082 +00:00:00')).toBe(
    1640784359640
  );
});

test('should throw error when parsing invalid date', () => {
  expect(() => parseDateString('20fdf21-12-29 14:25')).toThrow();
  expect(() => parseDateString('20fdf21-12-29 14:25 Ms Ol23')).toThrow();
});

test('should parse valid state string', () => {
  expect(parseStateString(JSON.stringify(dbStateCancelled))).toStrictEqual(
    dbStateCancelled
  );
});

test('should throw error when parsing invalid state string', () => {
  expect(() => parseStateString('invalid state string')).toThrow();
  expect(() =>
    parseStateString(
      JSON.stringify({
        Bob2: dbStateCancelled.Bob,
      })
    )
  ).toThrow();
});
