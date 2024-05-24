import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useSnackbar } from 'notistack';
import { useAppSelector } from '../../../../store/hooks';
import { piconerosToXmr } from '../../../../utils/conversionUtils';
import { parseDateString } from '../../../../utils/parseUtils';
import { store } from '../../../../store/store';
import { submitFeedbackViaHttp } from '../../../api';
import { CliLog } from '../../../../models/cliModel';

async function submitFeedback(body: string, swapId: string | number) {
  let attachedBody = '';

  if (swapId !== 0 && typeof swapId === 'string') {
    const swapInfo = store.getState().rpc.state.swapInfos[swapId];
    const logs = (await ipcRenderer.invoke(
      'get-swap-logs',
      swapId
    )) as CliLog[];

    if (swapInfo === undefined) {
      throw new Error(`Swap with id ${swapId} not found`);
    }

    attachedBody = `${JSON.stringify(swapInfo, null, 4)} \n\nLogs: ${logs
      .map((l) => JSON.stringify(l))
      .join('\n====\n')}`;
  }

  await submitFeedbackViaHttp(body, attachedBody);
}

/*
 * This component is a dialog that allows the user to submit feedback to the
 * developers. The user can enter a message and optionally attach logs from a
 * specific swap.
 * selectedSwap = 0 means no swap is attached
 */
function SwapSelectDropDown({
  selectedSwap,
  setSelectedSwap,
}: {
  selectedSwap: string | number;
  setSelectedSwap: (swapId: string | number) => void;
}) {
  const swaps = useAppSelector((state) =>
    Object.values(state.rpc.state.swapInfos)
  );

  return (
    <Select
      value={selectedSwap}
      label="Attach logs"
      variant="outlined"
      onChange={(e) => setSelectedSwap(e.target.value as string)}
    >
      <MenuItem value={0}>Do not attach logs</MenuItem>
      {swaps.map((swap) => (
        <MenuItem value={swap.swapId}>
          Swap {swap.swapId.substring(0, 5)}... from{' '}
          {new Date(parseDateString(swap.startDate)).toDateString()} (
          {piconerosToXmr(swap.xmrAmount).toFixed(5)} BTC)
        </MenuItem>
      ))}
    </Select>
  );
}

const MAX_FEEDBACK_LENGTH = 4000;

export default function FeedbackDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [bodyText, setBodyText] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const [selectedAttachedSwap, setSelectedAttachedSwap] = useState<
    string | number
  >(0);

  const bodyTooLong = bodyText.length > MAX_FEEDBACK_LENGTH;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Submit Feedback</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Got something to say? Drop us a message below. Wanna hear back from
          us? Include your contact info. If not, no worries - anonymous feedback
          is cool too. If you had an issue with a specific swap, select it from
          the dropdown to attach the logs. It'll help us figure out what went
          wrong. Hit that submit button when you're ready. We appreciate you
          taking the time to share your thoughts!
        </DialogContentText>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            variant="outlined"
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            label={
              bodyTooLong
                ? `Text is too long (${bodyText.length}/${MAX_FEEDBACK_LENGTH})`
                : 'Feedback'
            }
            multiline
            minRows={4}
            maxRows={4}
            fullWidth
            error={bodyTooLong}
          />
          <SwapSelectDropDown
            selectedSwap={selectedAttachedSwap}
            setSelectedSwap={setSelectedAttachedSwap}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          variant="contained"
          onClick={async () => {
            if (pending) {
              return;
            }

            try {
              setPending(true);
              await submitFeedback(bodyText, selectedAttachedSwap);
              enqueueSnackbar('Feedback submitted successfully!', {
                variant: 'success',
              });
            } catch (e) {
              console.error(`Failed to submit feedback: ${e}`);
              enqueueSnackbar('Failed to submit feedback', {
                variant: 'error',
              });
            } finally {
              setPending(false);
            }
            onClose();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
