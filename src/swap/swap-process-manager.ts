import path from 'path';
import { PathLike, promises as fs } from 'fs';
import { ipcRenderer } from 'electron';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import downloadSwapBinary, { BinaryDownloadStatus } from './downloader';
import useStore, { Provider } from '../renderer/store';
import {
  getNextState,
  handleBinaryDownloadStatusUpdate,
  handleSwapProcessExit,
  SwapLog,
  SwapState,
  SwapStateInitiated,
} from './swap-state-machine';

export async function getAppDataDir(): Promise<PathLike> {
  const appDataPath = await ipcRenderer.invoke('get-app-data-path');
  const dPath = path.join(appDataPath, 'unstoppableswap');
  await fs.mkdir(dPath, {
    recursive: true,
  });
  return dPath;
}

let swapProcess: ChildProcessWithoutNullStreams | null = null;

function setState(state: SwapState | null) {
  useStore.getState().setSwapState(state);
}

function getState(): SwapState {
  return <SwapState>useStore.getState().swapState;
}

function handleSwapLog(logText: string) {
  try {
    const parsedLog = JSON.parse(logText);
    if (
      parsedLog.timestamp &&
      ['DEBUG', 'INFO', 'WARN'].includes(parsedLog.level) &&
      parsedLog.fields.message
    ) {
      const swapLog = parsedLog as SwapLog;
      const prevState = getState();

      const nextState = getNextState(prevState, swapLog);

      console.log('next state', nextState);

      setState(nextState);
    } else {
      throw new Error('Required properties are missing');
    }
  } catch (e) {
    console.error(
      `Failed to parse swap log. Log text: ${logText} Error: ${e.message}`
    );
  }
}

export async function startSwap(
  provider: Provider,
  redeemAddress: string,
  refundAddress: string
) {
  const appDataPath = await getAppDataDir();
  const binaryInfo = await downloadSwapBinary(
    appDataPath,
    (status: BinaryDownloadStatus) => {
      const newState = handleBinaryDownloadStatusUpdate(status);
      setState(newState);
    }
  );

  const sellerIdentifier = `${provider.multiAddr}/p2p/${provider.peerId}`;

  const spawnArgs = provider.testnet
    ? [
        '--json',
        provider.testnet ? '--testnet' : '',
        '--debug',
        'buy-xmr',
        '--change-address',
        refundAddress,
        '--receive-address',
        redeemAddress,
        '--seller',
        sellerIdentifier,
      ]
    : [
        '--json',
        '--debug',
        'buy-xmr',
        '--change-address',
        refundAddress,
        '--receive-address',
        redeemAddress,
        '--seller',
        sellerIdentifier,
      ];

  swapProcess = spawn(`./${binaryInfo.name}`, spawnArgs, {
    cwd: appDataPath.toString(),
    env: {
      RUST_LOG: 'true',
    },
  });

  console.log(
    `Swap process spawned File: ${
      swapProcess.spawnfile
    } Arguments: ${swapProcess.spawnargs.join(' ')}`
  );

  swapProcess.stdout.setEncoding('utf8');
  swapProcess.stderr.setEncoding('utf8');

  swapProcess.stdout.on('data', (data) => {
    data
      .toString()
      .split(/(\r?\n)/g)
      .filter((s: string) => s.length > 4)
      .forEach((line: string) => {
        console.log(`Received stdout from swap process: ${line}`);
        handleSwapLog(line);
      });
  });

  swapProcess.stderr.on('data', (data) => {
    data
      .toString()
      .split(/(\r?\n)/g)
      .filter((s: string) => s.length > 4)
      .forEach((line: string) => {
        console.log(`Received stderr from swap process: ${line}`);
        handleSwapLog(line);
      });
  });

  swapProcess.on('exit', (code, signal) => {
    console.log(`Swap process excited Code: ${code} Signal: ${signal}`);
    const nextState = handleSwapProcessExit(getState(), code, signal);
    setState(nextState);
  });

  const state: SwapStateInitiated = {
    state: 'initiated',
    provider,
    refundAddress,
    redeemAddress,
    running: true,
  };

  setState(state);
}

export function stopSwap() {
  swapProcess?.kill('SIGINT');
}
