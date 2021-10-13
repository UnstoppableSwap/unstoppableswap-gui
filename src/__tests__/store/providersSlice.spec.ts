import { AnyAction } from '@reduxjs/toolkit';
import reducer, {
  setProviders,
} from '../../store/features/swap/providersSlice';
import { ExtendedProvider } from '../../models/store';

const exampleTestnetProvider: ExtendedProvider = {
  multiAddr: '/dnsaddr/t.xmr.example',
  peerId: '12394294389438924',
  testnet: true,
  age: 5,
  downtimeSeconds: 100,
  uptimeSeconds: 1000,
  maxSwapAmount: 1,
  minSwapAmount: 0.1,
  price: 0.1,
  relevancy: 1,
};

const exampleMainnetProvider: ExtendedProvider = {
  multiAddr: '/dnsaddr/xmr.example',
  peerId: '32394294389438924',
  testnet: false,
  age: 5,
  downtimeSeconds: 100,
  uptimeSeconds: 1000,
  maxSwapAmount: 1,
  minSwapAmount: 0.1,
  price: 0.1,
  relevancy: 1,
};

test('should return the initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual([]);
});

describe('testnet', () => {
  beforeAll(() => {
    process.env.TESTNET = 'true';
  });

  test('should set and filter the provider list', () => {
    expect(
      reducer(
        [],
        setProviders([exampleMainnetProvider, exampleTestnetProvider])
      )
    ).toEqual([exampleTestnetProvider]);
  });
});

describe('mainnet', () => {
  beforeAll(() => {
    process.env.TESTNET = 'false';
  });

  test('should set and filter the provider list', () => {
    expect(
      reducer(
        [],
        setProviders([exampleMainnetProvider, exampleTestnetProvider])
      )
    ).toEqual([exampleMainnetProvider]);
  });
});
