import { Box } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { removeAlert } from 'store/features/alertsSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';

export default function ApiAlertsBox() {
  const alerts = useAppSelector((state) => state.alerts.alerts);
  const dispatch = useAppDispatch();

  function onRemoveAlert(id: number) {
    dispatch(removeAlert(id));
  }

  return (
    <Box style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      {alerts.map((alert) => (
        <Alert
          variant="filled"
          severity={alert.severity}
          key={alert.id}
          onClose={() => onRemoveAlert(alert.id)}
        >
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.body}
        </Alert>
      ))}
    </Box>
  );
}
