import { AnyAction } from '@reduxjs/toolkit';
import reducer, {
  transactionsStatusChanged,
} from '../../store/features/electrumSlice';

test('should return the initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual({
    txs: [],
    connection: null,
  });
});

test('should set the electrum list', () => {
  const mockTx = {
    transaction: {
      swapId: '1093ad5f-4954-452b-ab2d-0bc4217bb209',
      kind: 'lock',
      txid: '74f4042ef3ae8dd335364346a72837500445c02481fd5e552aad3980008da644',
    },
    status: {
      confirmations: 249,
      hash: 'eb127f6f56cf9519f8d4b1e20e8c24b8437de511b04821dcb14c6ddbf7a2ddaa',
    },
  };

  expect(
    reducer({ connection: null, txs: [] }, transactionsStatusChanged([mockTx]))
  ).toStrictEqual({ txs: [mockTx], connection: null });
});
