import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import { isSwapResumable } from '../../../models/databaseModel';

export default function UnfinishedSwapsAlert() {
  const countResumeableSwaps = useAppSelector(
    (state) => state.history.filter(isSwapResumable).length
  );
  const navigate = useNavigate();

  if (countResumeableSwaps > 0) {
    return (
      <Alert
        severity="warning"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => navigate('/history')}
          >
            VIEW
          </Button>
        }
      >
        You have {countResumeableSwaps} unfinished swaps
      </Alert>
    );
  }
  return null;
}
