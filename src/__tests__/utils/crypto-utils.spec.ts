import {
  isBtcAddressValid,
  isXmrAddressValid,
} from '../../swap/utils/crypto-utils';

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
