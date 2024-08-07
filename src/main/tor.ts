import {
  ChildProcessWithoutNullStreams,
  spawn as spawnProc,
} from 'child_process';
import { store } from 'main/store/mainStore';
import {
  torProcessExited,
  torInitiate,
  torAppendStdOut,
} from '../store/features/torSlice';
import logger from '../utils/logger';
import { getTorBinary, makeFileExecutable } from './cli/dirs';

let torProc: ChildProcessWithoutNullStreams | null = null;

export function isTorRunning(): boolean {
  return torProc != null;
}

export function stopTor() {
  torProc?.kill();
  torProc = null;
}

export async function spawnTor(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (torProc) {
      stopTor();
    }

    const torBinary = getTorBinary();

    try {
      await makeFileExecutable(torBinary);
    } catch (err) {
      logger.error({ err, torBinary }, 'Failed to make tor binary executable');
    }

    torProc = spawnProc(`./${torBinary.fileName}`, {
      cwd: torBinary.dirPath,
      detached: false,
    });

    torProc.on('error', (err) => {
      logger.error({ err, torBinary }, `Failed to spawn tor`);
      reject(err);
    });

    // Added in: Node v15.1.0, v14.17.0
    torProc.on('spawn', () => {
      store.dispatch(torInitiate());
      logger.info({ torBinary }, 'Tor spawned');
      resolve();
    });

    torProc.on('exit', (exitCode, exitSignal) => {
      store.dispatch(torProcessExited({ exitCode, exitSignal }));
      logger.info({ exitCode, exitSignal, torBinary }, `Tor exited`);
    });

    [torProc.stdout, torProc.stderr].forEach((stream) =>
      stream.on('data', (data) => {
        const text = Buffer.from(data).toString();
        store.dispatch(torAppendStdOut(text));
        logger.debug({ text }, `Tor stdout/stderr`);
      }),
    );
  });
}
