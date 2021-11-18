import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { isBtcAddressValid } from '../../../utils/currencyUtils';
import { isTestnet } from '../../../store/config';

export default function BitcoinAddressTextField({
  address,
  onAddressChange,
  onAddressValidityChange,
  helperText,
  ...props
}: {
  address: string;
  onAddressChange: (address: string) => void;
  onAddressValidityChange: (valid: boolean) => void;
  helperText: string;
} & TextFieldProps) {
  const placeholder = isTestnet() ? 'tb1q4aelwalu...' : 'bc18ociqZ9mZ...';

  function getAddressError() {
    if (isBtcAddressValid(address, isTestnet())) {
      return null;
    }
    return `Only bech32 addresses are supported. They begin with "${
      isTestnet() ? 'tb1' : 'bc1'
    }"`;
  }

  const errorText = getAddressError();

  useEffect(() => {
    onAddressValidityChange(!errorText);
  }, [address]);

  return (
    <TextField
      value={address}
      onChange={(e) => onAddressChange(e.target.value)}
      error={!!errorText && address.length > 0}
      helperText={address.length > 0 ? errorText || helperText : helperText}
      placeholder={placeholder}
      variant="outlined"
      {...props}
    />
  );
}
