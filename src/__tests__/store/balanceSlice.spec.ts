import { AnyAction } from '@reduxjs/toolkit';

import reducer, {
  balanceAddLog,
  balanceInitiate,
  balanceProcessExited,
  BalanceSlice,
} from '../../store/features/balanceSlice';
import { CliLogCheckedBitcoinBalance } from '../../models/cliModel';

const mBalanceLog: CliLogCheckedBitcoinBalance = require('../mock_cli_logs/cli_log_checked_bitcoin_balance.json');

const initialBalanceState = {
  balanceValue: null,
  processRunning: false,
  exitCode: null,
  stdOut: '',
  logs: [],
};

test('should return the initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual(initialBalanceState);
});

test('should infer correct states from happy-path logs', () => {
  let slice: BalanceSlice = initialBalanceState;

  slice = reducer(slice, balanceInitiate());

  expect(slice).toStrictEqual({
    balanceValue: null,
    processRunning: true,
    exitCode: null,
    stdOut: '',
    logs: [],
  });

  slice = reducer(slice, balanceAddLog(mBalanceLog));

  expect(slice).toStrictEqual({
    balanceValue: 0.1,
    processRunning: true,
    exitCode: null,
    stdOut: '',
    logs: [mBalanceLog],
  });

  slice = reducer(
    slice,
    balanceProcessExited({
      exitCode: 1,
      exitSignal: null,
    })
  );

  expect(slice).toStrictEqual({
    balanceValue: 0.1,
    processRunning: false,
    exitCode: 1,
    stdOut: '',
    logs: [mBalanceLog],
  });
});
