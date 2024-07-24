import { useEffect } from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { isXmrAddressValid } from 'utils/conversionUtils';
import { isTestnet } from 'store/config';
import MoneroIcon from '../icons/MoneroIcon';

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
  const errorText = isXmrAddressValid(address, isTestnet())
    ? null
    : 'Not a valid Monero address';

  useEffect(() => {
    onAddressValidityChange(!errorText);
  }, [address, onAddressValidityChange, errorText]);

  return (
    <TextField
      value={address}
      onChange={(e) => onAddressChange(e.target.value)}
      error={!!errorText && address.length > 0}
      helperText={address.length > 0 ? errorText || helperText : helperText}
      placeholder={placeholder}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <MoneroIcon />
          </InputAdornment>
        )
      }}
      {...props}
    />
  );
}
