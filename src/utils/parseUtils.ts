/*
Extract btc amount from string

E.g: "0.00100000 BTC"
Output: 0.001
 */
import { pionerosToXmr, satsToBtc } from './currencyUtils';
import {
  isBtcCancelledDbState,
  isBtcLockedDbState,
  isBtcRedeemedDbState,
  isDoneBtcPunishedDbState,
  isDoneBtcRefundedDbState,
  isMergedBtcLockedDbState,
  isMergedBtcRedeemedDbState,
  isMergedEncSigSentDbState,
  isMergedExecutionSetupDoneDbState,
  isMergedXmrLockedDbState,
  isMergedXmrLockProofReceivedDbState,
  MergedDbState,
} from '../models/databaseModel';

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

/*
Extract btc amount from stdout from balance subcommand

E.g: "Bitcoin balance is 0.00000000 BTC"
Output: 0.00000000

E.g: "Bitcoin balance is 0.10300000 BTC"
Output: 0.10300000
 */
export function extractBtcBalanceFromBalanceString(
  text: string
): number | null {
  if (text != null) {
    if (text.match(/Bitcoin balance is (.*) BTC/)) {
      const balance = Number.parseFloat(text.split(' ')[3]);
      return balance;
    }
  }
  return null;
}

export function getSwapTxFees(dbState: MergedDbState): number | null {
  if (isBtcLockedDbState(dbState.state)) {
    const tx = dbState.state.Bob.BtcLocked.state3.tx_lock;

    const sumInput = tx.inner.inputs
      .map((input) => input.witness_utxo.value)
      .reduce((prev, next) => prev + next);

    const sumOutput = tx.inner.global.unsigned_tx.output
      .map((output) => output.value)
      .reduce((prev, next) => prev + next);

    return satsToBtc(sumInput - sumOutput);
  }

  return null;
}

export function getSwapBtcAmount(dbState: MergedDbState): number | null {
  if (isBtcLockedDbState(dbState.state)) {
    return satsToBtc(
      dbState.state.Bob.BtcLocked.state3.tx_lock.inner.global.unsigned_tx
        .output[0]?.value
    );
  }

  return null;
}

export function getSwapXmrAmount(dbState: MergedDbState): number {
  return pionerosToXmr(dbState.state.Bob.ExecutionSetupDone.state2.xmr);
}

export function isSwapResumable(dbState: MergedDbState): boolean {
  return (
    isMergedExecutionSetupDoneDbState(dbState) ||
    isMergedBtcLockedDbState(dbState) ||
    isMergedXmrLockProofReceivedDbState(dbState) ||
    isMergedXmrLockedDbState(dbState) ||
    isMergedEncSigSentDbState(dbState) ||
    isMergedBtcRedeemedDbState(dbState)
  );
}

export function isSwapCancellable(dbState: MergedDbState): boolean {
  return (
    isBtcLockedDbState(dbState.state) &&
    !isBtcRedeemedDbState(dbState.state) &&
    !isBtcCancelledDbState(dbState.state)
  );
}

export function isSwapRefundable(dbState: MergedDbState): boolean {
  return (
    isBtcLockedDbState(dbState.state) &&
    isBtcCancelledDbState(dbState.state) &&
    !isDoneBtcRefundedDbState(dbState.state) &&
    !isDoneBtcPunishedDbState(dbState.state)
  );
}
