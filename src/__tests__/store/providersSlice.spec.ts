import { AnyAction } from '@reduxjs/toolkit';
import reducer, {
  setProviders,
} from '../../store/features/swap/providersSlice';

test('should return the initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual([]);
});

test('should set the provider list', () => {
  expect(
    reducer(
      undefined,
      setProviders([
        {
          multiAddr: '/dnsaddr/xmr.example',
          peerId: '12394294389438924',
          testnet: true,
          age: 5,
          downtimeSeconds: 100,
          uptimeSeconds: 1000,
          maxSwapAmount: 1,
          minSwapAmount: 0.1,
          price: 0.1,
          relevancy: 1,
        },
      ])
    )
  ).toEqual([
    {
      multiAddr: '/dnsaddr/xmr.example',
      peerId: '12394294389438924',
      testnet: true,
      age: 5,
      downtimeSeconds: 100,
      uptimeSeconds: 1000,
      maxSwapAmount: 1,
      minSwapAmount: 0.1,
      price: 0.1,
      relevancy: 1,
    },
  ]);
});
