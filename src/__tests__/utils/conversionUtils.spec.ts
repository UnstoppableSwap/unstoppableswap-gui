import {
  btcToSats,
  getBitcoinTxExplorerUrl,
  getMoneroTxExplorerUrl,
  isBtcAddressValid,
  isXmrAddressValid,
  pionerosToXmr,
  satsToBtc,
  secondsToDays,
} from '../../utils/conversionUtils';

test('should convert sats to btc', () => {
  expect(satsToBtc(1350000000)).toBe(13.5);
});

test('should convert btc to sats', () => {
  expect(btcToSats(13.5)).toBe(1350000000);
});

test('should convert piconeros to xmr', () => {
  expect(pionerosToXmr(1)).toBe(0.000000000001);
});

test('should seconds to days', () => {
  expect(secondsToDays(86400)).toBe(1);
});

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

describe('xmr address validation', () => {
  test('should detect valid primary testnet address to be valid for testnet and invalid for mainnet', () => {
    expect(
      isXmrAddressValid(
        '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6',
        true
      )
    ).toBe(true);

    expect(
      isXmrAddressValid(
        '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6',
        false
      )
    ).toBe(false);
  });

  test('should detect valid subaddress testnet address to be valid for testnet and invalid for mainnet', () => {
    expect(
      isXmrAddressValid(
        '73a4nWuvkYoYoksGurDjKZQcZkmaxLaKbbeiKzHnMmqKivrCzq5Q2JtJG1UZNZFqLPbQ3MiXCk2Q5bdwdUNSr7X9QrPubkn',
        true
      )
    ).toBe(true);

    expect(
      isXmrAddressValid(
        '73a4nWuvkYoYoksGurDjKZQcZkmaxLaKbbeiKzHnMmqKivrCzq5Q2JtJG1UZNZFqLPbQ3MiXCk2Q5bdwdUNSr7X9QrPubkn',
        false
      )
    ).toBe(false);
  });

  test('should detect valid primary mainnet address to be valid for mainnet and invalid for testnet', () => {
    expect(
      isXmrAddressValid(
        '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K5Jv2684Rge',
        false
      )
    ).toBe(true);

    expect(
      isXmrAddressValid(
        '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K5Jv2684Rge',
        true
      )
    ).toBe(false);
  });

  test('should detect valid subaddress mainnet address to be valid for mainnet and invalid for testnet', () => {
    expect(
      isXmrAddressValid(
        '87jS4C7ngk9EHdqFFuxGFgg8AyH63dRUoULshWDybFJaP75UA89qsutG5B1L1QTc4w228nsqsv8EjhL7bz8fB3611Mh98mg',
        false
      )
    ).toBe(true);

    expect(
      isXmrAddressValid(
        '87jS4C7ngk9EHdqFFuxGFgg8AyH63dRUoULshWDybFJaP75UA89qsutG5B1L1QTc4w228nsqsv8EjhL7bz8fB3611Mh98mg',
        true
      )
    ).toBe(false);
  });

  test('should detect invalid address to be invalid for both mainnet and testnet', () => {
    expect(
      isXmrAddressValid(
        '9nWuvkYoYoksGurDjKZQcZkmaxLaKbbeiKzHnMmqKivrCzq5Q2JtJG1UZNZFqLPbQ3MiXCk2Q5bdwdUNSr7X9QrPubkn',
        true
      )
    ).toBe(false);

    expect(
      isXmrAddressValid(
        '9nWuvkYoYoksGurDjKZQcZkmaxLaKbbeiKzHnMmqKivrCzq5Q2JtJG1UZNZFqLPbQ3MiXCk2Q5bdwdUNSr7X9QrPubkn',
        false
      )
    ).toBe(false);
  });
});

describe('btc address validation', () => {
  test('should detect valid mainnet bech32 address to be valid for mainnet and invalid for testnet', () => {
    expect(
      isBtcAddressValid('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', false)
    ).toBe(true);
    expect(
      isBtcAddressValid('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', true)
    ).toBe(false);
  });

  test('should detect valid testnet bech32 address to be valid for testnet and invalid for mainnet', () => {
    expect(
      isBtcAddressValid('tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx', true)
    ).toBe(true);
    expect(
      isBtcAddressValid('tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx', false)
    ).toBe(false);
  });

  test('should detect valid testnet p2pkh address to be invalid for testnet and mainnet', () => {
    expect(isBtcAddressValid('mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn', true)).toBe(
      false
    );
    expect(isBtcAddressValid('mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn', false)).toBe(
      false
    );
  });

  test('should detect valid mainnet p2pkh address to be invalid for testnet and mainnet', () => {
    expect(isBtcAddressValid('17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem', true)).toBe(
      false
    );
    expect(isBtcAddressValid('17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem', false)).toBe(
      false
    );
  });

  test('should detect valid testnet p2sh address to be invalid for testnet and mainnet', () => {
    expect(isBtcAddressValid('2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc', true)).toBe(
      false
    );
    expect(
      isBtcAddressValid('2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc', false)
    ).toBe(false);
  });

  test('should detect valid mainnet p2sh address to be invalid for testnet and mainnet', () => {
    expect(isBtcAddressValid('3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX', true)).toBe(
      false
    );
    expect(isBtcAddressValid('3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX', false)).toBe(
      false
    );
  });

  test('should detect invalid address to be invalid for testnet and mainnet', () => {
    expect(isBtcAddressValid('73jdj2Mxjdj2929Mmcj399claMn', true)).toBe(false);
    expect(isBtcAddressValid('73jdj2Mxjdj2929Mmcj399claMn', false)).toBe(false);
  });
});
