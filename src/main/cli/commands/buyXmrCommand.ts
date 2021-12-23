import fs from 'fs/promises';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { SwapLog } from '../../../models/swapModel';
import { store } from '../../../store/store';
import {
  swapAddLog,
  swapAppendStdOut,
  swapInitiate,
  swapProcessExited,
} from '../../../store/features/swapSlice';
import { Provider } from '../../../models/storeModel';
import { spawnSubcommand } from '../cli';
import spawnBalanceCheck from './balanceCommand';
import { getSwapLogFile } from '../dirs';

async function onSwapLog(log: SwapLog) {
  store.dispatch(swapAddLog(log));
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
}

export async function spawnBuyXmr(
  provider: Provider,
  redeemAddress: string,
  refundAddress: string
) {
  try {
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
  } catch (e) {
    console.log(
      `Failed to spawn swap Provider: ${provider.peerId} RedeemAddress: ${redeemAddress} RefundAddress: ${refundAddress} Error: ${e}`
    );
    onProcExit(null, null);
  }
}

async function tryReplaySwapLogs(
  cli: ChildProcessWithoutNullStreams,
  swapId: string
) {
  try {
    const logFile = await getSwapLogFile(swapId);
    const prevLogData = await fs.readFile(logFile, {
      encoding: 'utf8',
    });
    cli.stderr.push(prevLogData);
  } catch (e) {
    console.error(
      `Failed to read and replay swap log file! SwapID: ${swapId} Error: ${e}`
    );
  }
}

export async function resumeBuyXmr(swapId: string) {
  try {
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

      await tryReplaySwapLogs(cli, swapId);
    } else {
      throw new Error('Could not find swap in database');
    }
  } catch (e) {
    console.log(`Failed to spawn swap resume SwapID: ${swapId} Error: ${e}`);
    onProcExit(null, null);
  }
}
