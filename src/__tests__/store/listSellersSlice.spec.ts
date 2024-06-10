import { TextEncoder, TextDecoder } from 'util';

import { AnyAction } from '@reduxjs/toolkit';
import { ExtendedProviderStatus } from 'models/apiModel';
import reducer, {
  setRegistryProviders,
} from '../../store/features/providersSlice';

Object.assign(global, { TextDecoder, TextEncoder });

const exampleTestnetProvider: ExtendedProviderStatus = {
  multiAddr: '/dnsaddr/t.xmr.example',
  peerId: '12394294389438924',
  testnet: true,
  age: 5,
  uptime: 0.99,
  maxSwapAmount: 1,
  minSwapAmount: 0.1,
  price: 0.1,
  relevancy: 1,
};

const exampleMainnetProvider: ExtendedProviderStatus = {
  multiAddr: '/dnsaddr/xmr.example',
  peerId: '32394294389438924',
  testnet: false,
  age: 5,
  uptime: 0.99,
  maxSwapAmount: 1,
  minSwapAmount: 0.1,
  price: 0.1,
  relevancy: 1,
};

const initialState = {
  rendezvous: {
    providers: [],
    processRunning: false,
    exitCode: null,
    stdOut: '',
    logs: [],
  },
  registry: {
    providers: null,
    failedReconnectAttemptsSinceLastSuccess: 0,
  },
  selectedProvider: null,
};

test('should return the initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
});

describe('testnet', () => {
  beforeAll(() => {
    process.env.TESTNET = 'true';
  });

  test('should set and filter the provider list', () => {
    expect(
      reducer(
        initialState,
        setRegistryProviders([exampleMainnetProvider, exampleTestnetProvider])
      )
    ).toMatchObject({
      registry: {
        providers: [exampleTestnetProvider],
        failedReconnectAttemptsSinceLastSuccess: 0,
      },
      selectedProvider: exampleTestnetProvider,
    });
  });
});

describe('mainnet', () => {
  beforeAll(() => {
    process.env.TESTNET = 'false';
  });

  test('should set and filter the provider list', () => {
    expect(
      reducer(
        initialState,
        setRegistryProviders([exampleMainnetProvider, exampleTestnetProvider])
      )
    ).toMatchObject({
      registry: {
        providers: [exampleMainnetProvider],
        failedReconnectAttemptsSinceLastSuccess: 0,
      },
      rendezvous: {
        providers: [],
        processRunning: false,
        exitCode: null,
        stdOut: '',
        logs: [],
      },
      selectedProvider: exampleMainnetProvider,
    });
  });
});
