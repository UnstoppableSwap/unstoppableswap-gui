import chokidar from 'chokidar';
import path from 'path';
import logger from '../../utils/logger';
import { swapLogFileDataChanged } from '../../store/features/logSlice';
import { store } from '../../store/store';
import { getCliLogsDir, getFileData } from './dirs';

async function readLogFileAndUpdateState(logFilePath: string) {
  const fileData = await getFileData(logFilePath);
  store.dispatch(swapLogFileDataChanged({ logFilePath, fileData }));
}

export default async function watchLogs() {
  const logsDir = await getCliLogsDir();
  const fileMask = path.join(logsDir, 'swap-*.log');

  const watcher = chokidar.watch(fileMask, {
    ignoreInitial: false,
  });

  watcher.on('add', readLogFileAndUpdateState);
  watcher.on('change', readLogFileAndUpdateState);

  logger.info({ logsDir }, 'Started watching logs');
}
