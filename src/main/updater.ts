import { autoUpdater } from 'electron-updater';
import logger from '../utils/logger';

export default async function initAutoUpdater() {
  autoUpdater.on('update-downloaded', (info: any) => {
    logger.info({info}, 'Update downloaded');
  });
  autoUpdater.on('update-available', (info: any) => {
    logger.info({info}, 'Update available');
  });
  autoUpdater.on('update-not-available', (info: any) => {
    logger.info({info}, 'Update not available');
  });
  autoUpdater.on('error', (err: any) => {
    logger.error({err}, 'Update error');
  });
  autoUpdater.on('checking-for-update', () => {
    logger.info('Checking for update');
  });

  autoUpdater.allowPrerelease = true;
  logger.info('Starting auto updater');
  console.log(autoUpdater.getFeedURL());
  await autoUpdater.checkForUpdatesAndNotify();
}
