import {
  extractAmountFromUnitString,
  getLinesOfString,
  getTimelockStatus,
  logFilePathToSwapId,
  parseDateString,
  parseStateString,
} from '../../utils/parseUtils';
import dbStateCancelled from '../mock_db_states/db_state_btc_cancelled.json';
import { TimelockStatusType } from '../../models/storeModel';

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
  // TODO: Handle timezones properly
  expect(
    parseDateString('2021-12-29 14:25:59.64082 +00:00:00')
  ).toBeGreaterThan(1640000000000);
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

test('should extract swap id from log file path', () => {
  expect(
    logFilePathToSwapId(
      '/Users/test/Library/Application Support/xmr-btc-swap/cli/testnet/logs/swap-0dba95a3-4b59-4b5b-bf69-40e7a0d6fbd3.log'
    )
  ).toBe('0dba95a3-4b59-4b5b-bf69-40e7a0d6fbd3');
});

test('should throw error when extracting swap id from invalid log file path', () => {
  expect(() =>
    logFilePathToSwapId(
      '/Users/test/Library/Application Support/xmr-btc-swap/cli/testnet/logs/abc'
    )
  ).toThrow();
});

test('should extract lines from string and ignore empty oness', () => {
  expect(getLinesOfString(`hello\nworld`)).toStrictEqual(['hello', 'world']);
  expect(getLinesOfString(`hello\r\nworld`)).toStrictEqual(['hello', 'world']);
  expect(
    getLinesOfString(`hello
world`)
  ).toStrictEqual(['hello', 'world']);
  expect(
    getLinesOfString(`hello

world`)
  ).toStrictEqual(['hello', 'world']);
});

describe('getTimelockStatus', () => {
  test('should parse not cancellable timelock', () => {
    expect(getTimelockStatus(6, 12, 4)).toStrictEqual({
      blocksUntilRefund: 2,
      blocksUntilPunish: 14,
      type: TimelockStatusType.NONE,
    });
  });
  test('should parse refundable timelock', () => {
    expect(getTimelockStatus(6, 12, 7)).toStrictEqual({
      blocksUntilPunish: 11,
      type: TimelockStatusType.REFUND_EXPIRED,
    });
  });
  test('should parse punishable timelock', () => {
    expect(getTimelockStatus(6, 12, 19)).toStrictEqual({
      type: TimelockStatusType.PUNISH_EXPIRED,
    });
  });
  test('should parse unknown timelock', () => {
    expect(getTimelockStatus(6, 12, undefined)).toStrictEqual({
      type: TimelockStatusType.UNKNOWN,
    });
  });
});
