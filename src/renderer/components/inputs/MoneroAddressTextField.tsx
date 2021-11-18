import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { isXmrAddressValid } from '../../../utils/currencyUtils';
import { isTestnet } from '../../../store/config';

export default function MoneroAddressTextField({
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
  const placeholder = isTestnet() ? '59McWTPGc745...' : '888tNkZrPN6J...';

  function getAddressError() {
    if (isXmrAddressValid(address, isTestnet())) {
      return null;
    }
    return 'Not a valid monero address';
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
