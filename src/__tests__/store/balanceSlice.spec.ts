import { AnyAction } from '@reduxjs/toolkit';

import reducer, {
  balanceInitiate,
  balanceProcessExited,
  balanceAppendStdOut,
  BalanceState,
} from '../../store/features/balanceSlice';

const mBalanceLog = `[Log] initiated
Bitcoin balance is 0.00001000 BTC`;

const initialBalanceState = {
  balanceValue: null,
  processRunning: false,
  exitCode: null,
  stdOut: '',
};

test('should return the initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual(initialBalanceState);
});

test('should infer correct states from happy-path logs', () => {
  let balance: BalanceState = initialBalanceState;

  balance = reducer(balance, balanceInitiate());

  expect(balance).toStrictEqual({
    balanceValue: null,
    processRunning: true,
    exitCode: null,
    stdOut: '',
  });

  balance = reducer(balance, balanceAppendStdOut(mBalanceLog));

  expect(balance).toStrictEqual({
    balanceValue: 0.00001,
    processRunning: true,
    exitCode: null,
    stdOut: mBalanceLog,
  });

  balance = reducer(
    balance,
    balanceProcessExited({
      exitCode: 1,
      exitSignal: null,
    })
  );

  expect(balance).toStrictEqual({
    balanceValue: 0.00001,
    processRunning: false,
    exitCode: 1,
    stdOut: mBalanceLog,
  });
});
