import fs from 'fs/promises';
import { SwapLog } from '../../../models/swapModel';
import { store } from '../../../store/store';
import {
  swapAddLog,
  swapAppendStdOut,
  swapDownloadProgressUpdate,
  swapInitiate,
  swapProcessExited,
} from '../../../store/features/swapSlice';
import { Provider } from '../../../models/storeModel';
import { BinaryDownloadStatus } from '../downloader';
import { getSwapLogFile, spawnSubcommand } from '../cli';
import spawnBalanceCheck from './balanceCommand';
import { checkFileExists } from '../../../utils/fileUtils';

async function onSwapLog(log: SwapLog) {
  store.dispatch(swapAddLog(log));

  const { swapId } = store.getState().swap;
  if (swapId) {
    const logFile = await getSwapLogFile(swapId);

    if (!(await checkFileExists(logFile))) {
      console.log(
        `Creating log file ${logFile} for swap ${swapId} and appending all past stdout to it`
      );
      const allStdOut = store.getState().swap.stdOut;
      await fs.appendFile(logFile, allStdOut);
    }
  }
}

function onDownloadProgress(status: BinaryDownloadStatus) {
  store.dispatch(swapDownloadProgressUpdate(status));
}

function onProcExit(code: number | null, signal: NodeJS.Signals | null) {
  store.dispatch(
    swapProcessExited({
      exitCode: code,
      exitSignal: signal,
    })
  );

  spawnBalanceCheck();
}

async function onStdOut(data: string) {
  store.dispatch(swapAppendStdOut(data));

  const { swapId } = store.getState().swap;
  if (swapId) {
    const logFile = await getSwapLogFile(swapId);

    if (await checkFileExists(logFile)) {
      await fs.appendFile(logFile, data);
    }
  }
}

export async function spawnBuyXmr(
  provider: Provider,
  redeemAddress: string,
  refundAddress: string
) {
  const sellerIdentifier = `${provider.multiAddr}/p2p/${provider.peerId}`;

  store.dispatch(
    swapInitiate({
      provider,
      resume: false,
    })
  );

  await spawnSubcommand(
    'buy-xmr',
    {
      'change-address': refundAddress,
      'receive-address': redeemAddress,
      seller: sellerIdentifier,
    },
    onDownloadProgress,
    onSwapLog,
    onProcExit,
    onStdOut
  );

  store.dispatch(
    swapInitiate({
      provider,
      resume: false,
    })
  );
}

export async function resumeBuyXmr(swapId: string) {
  const provider = store
    .getState()
    .history.find((h) => h.swapId === swapId)?.provider;

  if (provider) {
    store.dispatch(
      swapInitiate({
        provider,
        resume: true,
      })
    );

    const cli = await spawnSubcommand(
      'resume',
      {
        'swap-id': swapId,
      },
      onDownloadProgress,
      onSwapLog,
      onProcExit,
      onStdOut
    );

    store.dispatch(
      swapInitiate({
        provider,
        resume: true,
      })
    );

    try {
      const logFile = await getSwapLogFile(swapId);
      const prevLogData = await fs.readFile(logFile, {
        encoding: 'utf8',
      });
      cli.stderr.push(prevLogData);
    } catch (e) {
      console.error(`Failed to read swap log file: ${e}`);
    }
  } else {
    console.error('Could not find swap in database');
  }
}
