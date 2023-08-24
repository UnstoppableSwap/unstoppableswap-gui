import { Box, makeStyles } from '@material-ui/core';
import IpcInvokeButton from 'renderer/components/IpcInvokeButton';
import { useAppSelector } from 'store/hooks';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { RpcProcessStateType } from 'models/rpcModel';
import InfoBox from '../../modal/swap/InfoBox';
import PaperTextBox from '../../modal/PaperTextBox';

const useStyles = makeStyles((theme) => ({
  actionsOuter: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

export default function RpcControlBox() {
  const rpcProcess = useAppSelector((state) => state.rpc.process);
  const isRunning =
    rpcProcess.type === RpcProcessStateType.STARTED ||
    rpcProcess.type === RpcProcessStateType.LISTENING_FOR_CONNECTIONS;
  const classes = useStyles();

  return (
    <InfoBox
      title="Swap Daemon"
      mainContent={
        isRunning || rpcProcess.type === RpcProcessStateType.EXITED ? (
          <PaperTextBox stdOut={rpcProcess.stdOut} />
        ) : null
      }
      additionalContent={
        <Box className={classes.actionsOuter}>
          <IpcInvokeButton
            variant="contained"
            ipcChannel="spawn-start-rpc"
            ipcArgs={[]}
            endIcon={<PlayArrowIcon />}
            disabled={isRunning}
          >
            Start Daemon
          </IpcInvokeButton>
          <IpcInvokeButton
            variant="contained"
            ipcChannel="stop-cli"
            ipcArgs={[]}
            endIcon={<StopIcon />}
            disabled={!isRunning}
          >
            Stop Daemon
          </IpcInvokeButton>
        </Box>
      }
      icon={null}
      loading={false}
    />
  );
}