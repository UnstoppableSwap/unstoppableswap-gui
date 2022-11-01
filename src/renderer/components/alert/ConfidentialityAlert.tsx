import { Alert } from '@material-ui/lab';

export default function ConfidentialityAlert() {
  return (
    <Alert severity="warning">
      This page contains confidential information including private keys. Keep
      this information to yourself. You will lose your funds if you do not!
    </Alert>
  );
}
