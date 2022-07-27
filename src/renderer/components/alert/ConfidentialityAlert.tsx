import { Alert } from '@material-ui/lab';

export default function ConfidentialityAlert() {
  return (
    <Alert severity="warning">
      This page contains confidential information including private keys. Keep
      this information to yourself. Otherwise you will lose your money!
    </Alert>
  );
}
