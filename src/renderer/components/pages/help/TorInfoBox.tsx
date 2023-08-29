import { Box, makeStyles, Typography } from '@material-ui/core';
import IpcInvokeButton from 'renderer/components/IpcInvokeButton';
import { useAppSelector } from 'store/hooks';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import InfoBox from '../../modal/swap/InfoBox';
import CliLogsBox from '../../other/RenderedCliLog';

const useStyles = makeStyles((theme) => ({
  actionsOuter: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

export default function TorInfoBox() {
  const isTorRunning = useAppSelector((state) => state.tor.processRunning);
  const torStdOut = useAppSelector((s) => s.tor.stdOut);
  const classes = useStyles();

  return (
    <InfoBox
      title="Tor (The Onion Router)"
      mainContent={
        <Box
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Typography variant="subtitle2">
            Tor is a network that allows you to anonymously connect to the
            internet. It is a free and open network that is operated by
            volunteers. You can start and stop Tor by clicking the buttons
            below. If Tor is running, all traffic will be routed through it and
            the swap provider will not be able to see your IP address.
          </Typography>
          <CliLogsBox label="Tor Daemon Logs" logs={[torStdOut]} />
        </Box>
      }
      additionalContent={
        <Box className={classes.actionsOuter}>
          <IpcInvokeButton
            variant="contained"
            disabled={isTorRunning}
            ipcChannel="spawn-tor"
            ipcArgs={[]}
            endIcon={<PlayArrowIcon />}
          >
            Start Tor
          </IpcInvokeButton>
          <IpcInvokeButton
            variant="contained"
            disabled={!isTorRunning}
            ipcChannel="stop-tor"
            ipcArgs={[]}
            endIcon={<StopIcon />}
          >
            Stop Tor
          </IpcInvokeButton>
        </Box>
      }
      icon={null}
      loading={false}
    />
  );
}
