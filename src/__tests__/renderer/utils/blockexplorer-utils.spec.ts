import {
  getBitcoinTxExplorerUrl,
  getMoneroTxExplorerUrl,
} from '../../../renderer/utils/blockexplorer-utils';

test('should compute correct btc mainnet txid blockexplorer url', () => {
  expect(
    getBitcoinTxExplorerUrl(
      '9667aa63c2bd953b33de5ebc283ff483a65234b3115a53ccae9cc82371e211dd',
      false
    )
  ).toBe(
    'https://blockchair.com/bitcoin/transaction/9667aa63c2bd953b33de5ebc283ff483a65234b3115a53ccae9cc82371e211dd'
  );

  expect(
    getBitcoinTxExplorerUrl(
      'adacf40f257376fd29531bb08fad8e5450f857f82a31438e15054d2b6404113e',
      false
    )
  ).toBe(
    'https://blockchair.com/bitcoin/transaction/adacf40f257376fd29531bb08fad8e5450f857f82a31438e15054d2b6404113e'
  );
});

test('should compute correct btc testnet txid blockexplorer url', () => {
  expect(
    getBitcoinTxExplorerUrl(
      'c70b2ae3a2397c340df99da61ae36bfaa2523f4dd9a9cdd3283f6505eb346869',
      true
    )
  ).toBe(
    'https://blockchair.com/bitcoin/testnet/transaction/c70b2ae3a2397c340df99da61ae36bfaa2523f4dd9a9cdd3283f6505eb346869'
  );

  expect(
    getBitcoinTxExplorerUrl(
      '2fcfbc4f61a6657d043e2236315a1e7a1c3d13820165d4f887ffe4acac81a1df',
      true
    )
  ).toBe(
    'https://blockchair.com/bitcoin/testnet/transaction/2fcfbc4f61a6657d043e2236315a1e7a1c3d13820165d4f887ffe4acac81a1df'
  );
});

test('should compute correct xmr mainnet txid blockexplorer url', () => {
  expect(
    getMoneroTxExplorerUrl(
      'cdcbef3d1e4653eda2ab67901d5e66d1d9fc7624079b2910b5c9aff58e954238',
      false
    )
  ).toBe(
    'https://xmrchain.net/tx/cdcbef3d1e4653eda2ab67901d5e66d1d9fc7624079b2910b5c9aff58e954238'
  );

  expect(
    getMoneroTxExplorerUrl(
      '443bec12b0589ff9feb8e7fd8fb08c1a24d755e901b0d8a7197807613b9ff391',
      false
    )
  ).toBe(
    'https://xmrchain.net/tx/443bec12b0589ff9feb8e7fd8fb08c1a24d755e901b0d8a7197807613b9ff391'
  );
});

test('should compute correct xmr testnet txid blockexplorer url', () => {
  expect(
    getMoneroTxExplorerUrl(
      '59e02e88fca6edbdafbddb97a87dc6f616eae2059e44207918c6c9f91a261117',
      true
    )
  ).toBe(
    'https://stagenet.xmrchain.net/tx/59e02e88fca6edbdafbddb97a87dc6f616eae2059e44207918c6c9f91a261117'
  );

  expect(
    getMoneroTxExplorerUrl(
      'a358cac3efacd939821977357acaa32f2d571bb332bf306376f35f2eb415ba1a',
      true
    )
  ).toBe(
    'https://stagenet.xmrchain.net/tx/a358cac3efacd939821977357acaa32f2d571bb332bf306376f35f2eb415ba1a'
  );
});
