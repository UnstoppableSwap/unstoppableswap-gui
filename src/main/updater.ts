import { autoUpdater } from 'electron-updater';
import logger from '../utils/logger';

export default async function initAutoUpdater() {
  autoUpdater.on('update-downloaded', (info: any) => {
    logger.info({info}, 'Update downloaded');
  });
  autoUpdater.on('update-available', (info: any) => {
    logger.info({ info }, 'Update available');
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
  autoUpdater.autoDownload = false;

  logger.info('Starting auto updater');
  await autoUpdater.checkForUpdatesAndNotify({ title: 'Update available', body: '{appName} is not on the latest version. Version {version} is available. We recommend you update now by downloading the latest release from https://unstoppableswap.net/' });
}
