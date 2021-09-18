import path from 'path';
import { PathLike, promises as fs } from 'fs';
import { ipcRenderer } from 'electron';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import downloadSwapBinary, { BinaryDownloadStatus } from './downloader';
import { store } from '../store/store';
import {
  aliceLockedMoneroLog,
  bitcoinTransactionStatusChangedLog,
  downloadProgressUpdate,
  initiateSwap,
  processExited,
  publishedBitcoinTransactionLog,
  receivedQuoteLog,
  startingNewSwapLog,
  transferedXmrToWalletLog,
  waitingForBitcoinDepositLog,
  xmrLockStatusChangedLog,
} from '../store/features/swap/swapSlice';
import {
  SwapLog,
  SwapLogAliceLockedMonero,
  SwapLogBtcTxStatusChanged,
  SwapLogPublishedBtcTx,
  SwapLogReceivedQuote,
  SwapLogReceivedXmrLockTxConfirmation,
  SwapLogRedeemedXmr,
  SwapLogStartedSwap,
  SwapLogWaitingForBtcDeposit,
} from '../models/swap';
import { Provider } from '../models/store';

export async function getAppDataDir(): Promise<PathLike> {
  const appDataPath = await ipcRenderer.invoke('get-app-data-path');
  const dPath = path.join(appDataPath, 'unstoppableswap');
  await fs.mkdir(dPath, {
    recursive: true,
  });
  return dPath;
}

let swapProcess: ChildProcessWithoutNullStreams | null = null;

function handleSwapLog(logText: string) {
  try {
    const parsedLog = JSON.parse(logText);
    if (
      parsedLog.timestamp &&
      ['DEBUG', 'INFO', 'WARN'].includes(parsedLog.level) &&
      parsedLog.fields.message
    ) {
      const log = parsedLog as SwapLog;

      switch (log.fields.message) {
        case 'Received quote':
          store.dispatch(receivedQuoteLog(log as SwapLogReceivedQuote));
          break;
        case 'Waiting for Bitcoin deposit':
          store.dispatch(
            waitingForBitcoinDepositLog(log as SwapLogWaitingForBtcDeposit)
          );
          break;
        case 'Received Bitcoin':
          break;
        case 'Starting new swap':
          store.dispatch(startingNewSwapLog(log as SwapLogStartedSwap));
          break;
        case 'Published Bitcoin transaction':
          store.dispatch(
            publishedBitcoinTransactionLog(log as SwapLogPublishedBtcTx)
          );
          break;
        case 'Bitcoin transaction status changed':
          store.dispatch(
            bitcoinTransactionStatusChangedLog(log as SwapLogBtcTxStatusChanged)
          );
          break;
        case 'Alice locked Monero':
          store.dispatch(aliceLockedMoneroLog(log as SwapLogAliceLockedMonero));
          break;
        case 'Received new confirmation for Monero lock tx':
          store.dispatch(
            xmrLockStatusChangedLog(log as SwapLogReceivedXmrLockTxConfirmation)
          );
          break;
        case 'Successfully transferred XMR to wallet':
          store.dispatch(transferedXmrToWalletLog(log as SwapLogRedeemedXmr));
          break;
        default:
          console.error(`Swap log was not reduced Log: ${JSON.stringify(log)}`);
      }
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
      store.dispatch(downloadProgressUpdate(status));
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
  });

  console.log(
    `Swap process spawned File: ${
      swapProcess.spawnfile
    } Arguments: ${swapProcess.spawnargs.join(' ')}`
  );

  [swapProcess.stderr, swapProcess.stdout].forEach((stream) => {
    stream.setEncoding('utf8');
    stream.on('data', (data) => {
      data
        .toString()
        .split(/(\r?\n)/g)
        .filter((s: string) => s.length > 4)
        .forEach((line: string) => {
          console.log(`Received stdout from swap process: ${line}`);
          handleSwapLog(line);
        });
    });
  });

  swapProcess.on('exit', (code, signal) => {
    console.log(`Swap process excited Code: ${code} Signal: ${signal}`);
    store.dispatch(
      processExited({
        exitCode: code,
        exitSignal: signal,
      })
    );
  });

  store.dispatch(
    initiateSwap({
      provider,
      refundAddress,
      redeemAddress,
    })
  );
}

export function stopSwap() {
  swapProcess?.kill('SIGINT');
}
