import path from 'path';
import { DbState, isDbState } from '../models/databaseModel';
import { TimelockStatus, TimelockStatusType } from '../models/storeModel';
import { CliLog, isCliLog } from '../models/cliModel';

/*
Extract btc amount from string

E.g: "0.00100000 BTC"
Output: 0.001
 */
export function extractAmountFromUnitString(text: string): number | null {
  if (text != null) {
    const parts = text.split(' ');
    if (parts.length === 2) {
      const amount = Number.parseFloat(parts[0]);
      return amount;
    }
  }
  return null;
}

export function parseStateString(str: string): DbState {
  try {
    const dbState = JSON.parse(str) as DbState;
    if (isDbState(dbState)) {
      return dbState;
    }
    throw new Error(`State string is not a valid db str: ${str}`);
  } catch (e) {
    throw new Error(`State string could not be parsed Error: ${e} str: ${str}`);
  }
}

// E.g 2021-12-29 14:25:59.64082 +00:00:00
export function parseDateString(str: string): number {
  const parts = str.split(' ').slice(0, -1);
  if (parts.length !== 2) {
    throw new Error(
      `Date string does not consist solely of date and time Str: ${str} Parts: ${parts}`
    );
  }
  const wholeString = parts.join(' ');
  const date = Date.parse(wholeString);
  if (Number.isNaN(date)) {
    throw new Error(
      `Date string could not be parsed Str: ${str} Parts: ${parts}`
    );
  }
  return date;
}

export function getLinesOfString(data: string): string[] {
  return data
    .toString()
    .replace('\r\n', '\n')
    .replace('\r', '\n')
    .split('\n')
    .filter((l) => l.length > 0);
}

export function getLogsFromRawFileString(rawFileData: string): CliLog[] {
  return getLinesOfString(rawFileData)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    })
    .filter(isCliLog);
}

/*
E.g /Users/test/Library/Application Support/xmr-btc-swap/cli/testnet/logs/swap-0dba95a3-4b59-4b5b-bf69-40e7a0d6fbd3.log
=> 0dba95a3-4b59-4b5b-bf69-40e7a0d6fbd3
*/
export function logFilePathToSwapId(logFilePath: string): string {
  if (logFilePath.includes('swap-') && logFilePath.endsWith('.log')) {
    const fileName = path.basename(logFilePath);
    const fileNameWithoutExtension = fileName.split('.')[0];
    const swapId = fileNameWithoutExtension.substring(5);
    return swapId;
  }
  throw new Error(`Log file path does not contain swap id ${logFilePath}`);
}

export function logsToRawString(logs: CliLog[]): string {
  return logs.map((l) => JSON.stringify(l)).join('\n');
}

export function getTimelockStatus(
  refundTimelock: number,
  punishTimelock: number,
  confirmations: number | undefined
): TimelockStatus {
  if (confirmations === undefined) {
    return { type: TimelockStatusType.UNKNOWN };
  }
  const blocksUntilRefund = refundTimelock - confirmations;
  const blocksUntilPunish = refundTimelock + punishTimelock - confirmations;

  if (blocksUntilRefund > 0 && blocksUntilPunish > 0) {
    return {
      blocksUntilPunish,
      blocksUntilRefund,
      type: TimelockStatusType.NONE,
    };
  }
  if (blocksUntilRefund <= 0 && blocksUntilPunish > 0) {
    return {
      blocksUntilPunish,
      type: TimelockStatusType.REFUND_EXPIRED,
    };
  }
  if (blocksUntilPunish <= 0) {
    return {
      type: TimelockStatusType.PUNISH_EXPIRED,
    };
  }
  return { type: TimelockStatusType.UNKNOWN };
}
