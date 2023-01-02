import { autoUpdater } from 'electron-updater';
import logger from '../utils/logger';
import { dialog } from 'electron';
import { mainWindow } from './main';

export default async function initAutoUpdater() {
  autoUpdater.on('update-downloaded', (info: any) => {
    logger.info({ info }, 'Update downloaded');
  });
  autoUpdater.on('update-available', (info: any) => {
    if (mainWindow === null) {
      return;
    }
    dialog.showMessageBoxSync(mainWindow, {
      title: 'Update available',
      message: `Version ${info.version} is available. We recommend you update now by downloading the latest release from https://unstoppableswap.net/`,
      type: 'info',
    });
  });
  autoUpdater.on('update-not-available', (info: any) => {
    logger.info({ info }, 'Update not available');
  });
  autoUpdater.on('error', (err: any) => {
    logger.error({ err }, 'Update error');
  });
  autoUpdater.on('checking-for-update', () => {
    logger.info('Checking for update');
  });

  autoUpdater.allowPrerelease = true;
  autoUpdater.autoDownload = false;

  logger.info('Starting auto updater');

  await autoUpdater.checkForUpdatesAndNotify();
}
