import { UpdateInfo, autoUpdater } from 'electron-updater';
import logger from '../utils/logger';
import { isDevelopment } from 'store/config';
import { updateReceived } from 'store/features/updateSlice';
import { store } from './store/mainStore';

export default async function initAutoUpdater() {
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    store.dispatch(updateReceived(info));
    logger.info({ info }, 'Update available');
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

  autoUpdater.autoDownload = false;
  autoUpdater.allowPrerelease = false;

  // This is for development purposes only. It will force the auto updater to use the dev-app-update.yml file for updates.
  if (isDevelopment) {
    autoUpdater.forceDevUpdateConfig = true;
    autoUpdater.allowDowngrade = true;
  }

  logger.info('Starting auto updater');
  await autoUpdater.checkForUpdates();
}
