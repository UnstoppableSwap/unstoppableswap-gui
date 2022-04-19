import { AnyAction } from '@reduxjs/toolkit';

import reducer, { swapLogFileDataChanged } from '../../store/features/logSlice';

test('should return the initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual({});
});

test('should set logs from action swapLogFileDataChanged', () => {
  const newSlice = reducer(
    {},
    swapLogFileDataChanged({
      fileData: `{"timestamp":"Apr 20 00:55:28.695","level":"DEBUG","fields":{"message":"Using existing sqlite database."}}
{"timestamp":"Apr 20 00:55:31.183","level":"DEBUG","fields":{"message":"Starting monero-wallet-rpc","port":"63161"}}`,
      logFilePath: '/folder/logs/swap-547fa20f-fdc2-44d4-a1f8-acef21f350b6.log',
    })
  );

  expect(newSlice).toStrictEqual({
    '547fa20f-fdc2-44d4-a1f8-acef21f350b6': [
      {
        fields: {
          message: 'Using existing sqlite database.',
        },
        level: 'DEBUG',
        timestamp: 'Apr 20 00:55:28.695',
      },
      {
        fields: {
          message: 'Starting monero-wallet-rpc',
          port: '63161',
        },
        level: 'DEBUG',
        timestamp: 'Apr 20 00:55:31.183',
      },
    ],
  });
});

test('should replace existing logs from action swapLogFileDataChanged', () => {
  const newSlice = reducer(
    {
      '547fa20f-fdc2-44d4-a1f8-acef21f350b6': [
        {
          fields: {
            message: 'Using existing sqlite database.',
          },
          level: 'DEBUG',
          timestamp: 'Apr 20 00:55:28.695',
        },
      ],
    },
    swapLogFileDataChanged({
      fileData: `{"timestamp":"Apr 20 00:55:31.183","level":"DEBUG","fields":{"message":"Starting monero-wallet-rpc","port":"63161"}}`,
      logFilePath: '/folder/logs/swap-547fa20f-fdc2-44d4-a1f8-acef21f350b6.log',
    })
  );

  expect(newSlice).toStrictEqual({
    '547fa20f-fdc2-44d4-a1f8-acef21f350b6': [
      {
        fields: {
          message: 'Starting monero-wallet-rpc',
          port: '63161',
        },
        level: 'DEBUG',
        timestamp: 'Apr 20 00:55:31.183',
      },
    ],
  });
});
