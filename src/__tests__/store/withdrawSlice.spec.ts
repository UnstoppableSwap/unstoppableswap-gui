import { AnyAction } from '@reduxjs/toolkit';

import reducer, {
  withdrawAddLog,
  withdrawInitiate,
  withdrawProcessExited,
} from '../../store/features/withdrawSlice';
import { CliLog } from '../../models/cliModel';
import { WithdrawSlice, WithdrawStateType } from '../../models/storeModel';

const mWithdrawLog: CliLog = require('../mock_cli_logs/cli_log_published_btc_withdraw_tx.json');

const initialWithdrawState: WithdrawSlice = {
  state: null,
  stdOut: '',
  logs: [],
  processRunning: false,
};

test('should return the initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual(initialWithdrawState);
});

test('should infer correct states from happy-path logs', () => {
  let withdraw = initialWithdrawState;

  withdraw = reducer(withdraw, withdrawInitiate());

  expect(withdraw).toStrictEqual({
    state: {
      type: WithdrawStateType.INITIATED,
    },
    stdOut: '',
    logs: [],
    processRunning: true,
  });

  withdraw = reducer(withdraw, withdrawAddLog(mWithdrawLog));

  expect(withdraw).toStrictEqual({
    state: {
      type: WithdrawStateType.BTC_WITHDRAW_TX_IN_MEMPOOL,
      txid: '3462e1179c6035120608921bf1177c65456bd35fd31ed37545a19fd58818f796',
    },
    stdOut: '',
    logs: [mWithdrawLog],
    processRunning: true,
  });

  withdraw = reducer(
    withdraw,
    withdrawProcessExited({
      exitCode: 0,
      exitSignal: null,
    })
  );

  expect(withdraw).toStrictEqual({
    state: {
      type: WithdrawStateType.PROCESS_EXITED,
      exitSignal: null,
      exitCode: 0,
      prevState: {
        type: WithdrawStateType.BTC_WITHDRAW_TX_IN_MEMPOOL,
        txid: '3462e1179c6035120608921bf1177c65456bd35fd31ed37545a19fd58818f796',
      },
    },
    stdOut: '',
    logs: [mWithdrawLog],
    processRunning: false,
  });
});
