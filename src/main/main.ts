/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import blocked from 'blocked-at';
import {
  getPlatform,
  getStubTestnetProvider,
  isDevelopment,
} from 'store/config';
import { resolveHtmlPath } from './util';
import { startRPC, stopCli } from './cli/cli';
import getSavedLogsOfSwapId, { getAssetPath, fixAppDataPath } from './cli/dirs';
import initSocket from './socket';
import logger from '../utils/logger';
import { spawnTor, stopTor } from './tor';
import {
  buyXmr,
  cancelRefundSwap,
  checkBitcoinBalance,
  getMoneroRecoveryKeys,
  listSellers,
  resumeSwap,
  suspendCurrentSwap,
  withdrawAllBitcoin,
} from './cli/rpc';
import initAutoUpdater from './updater';

let mainWindow: BrowserWindow | null = null;

async function installExtensions() {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch((e: any) =>
      logger.error(
        { error: e.toString() },
        'Failed to install browser extensions'
      )
    );
}

async function createWindow() {
  if (isDevelopment) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    title: `UnstoppableSwap ${app.getVersion()}`,
    show: false,
    width: 1024,
    height: 728,
    minHeight: 728,
    minWidth: 1024,
    resizable: isDevelopment,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Temporary fix for CORS issues
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/main/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.addListener('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
}

fixAppDataPath();

app.on('will-quit', async () => {
  await stopCli();
  stopTor();
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (getPlatform() !== 'mac') {
    app.quit();
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (gotTheLock) {
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
  });

  app
    .whenReady()
    .then(async () => {
      createWindow();
      initSocket();
      await startRPC();

      // Don't spawn Tor if we have a stub testnet provider
      // It's most likely gonna be a local one and we cannot build Tor circuits to it
      if (getStubTestnetProvider() != null) {
        await spawnTor();
      }

      initAutoUpdater();
      return 0;
    })
    .catch((e) =>
      logger.error(
        { error: (e as Error).toString() },
        'Failed to fully initiate app'
      )
    );
} else {
  logger.error('Failed to acquire lock! Exiting...');
  app.quit();
}

if (isDevelopment) {
  blocked(
    (time, stack) => {
      logger.trace({ time, stack }, `Main thread has been blocked`);
    },
    {
      threshold: 250,
    }
  );
}

ipcMain.handle('stop-cli', stopCli);

ipcMain.handle('spawn-start-rpc', startRPC);

ipcMain.handle('spawn-balance-check', () => checkBitcoinBalance(true));

ipcMain.handle('suspend-current-swap', suspendCurrentSwap);

ipcMain.handle(
  'spawn-buy-xmr',
  (_event, provider, redeemAddress, refundAddress) =>
    buyXmr(redeemAddress, refundAddress, provider)
);

ipcMain.handle('spawn-cancel-refund', (_event, swapId) =>
  cancelRefundSwap(swapId)
);

ipcMain.handle('spawn-monero-recovery', (_event, swapId) =>
  getMoneroRecoveryKeys(swapId)
);

ipcMain.handle('spawn-resume-swap', (_event, swapId) => resumeSwap(swapId));

ipcMain.handle('spawn-withdraw-btc', (_event, address) =>
  withdrawAllBitcoin(address)
);

ipcMain.handle('spawn-list-sellers', (_event, rendezvousPointAddress) =>
  listSellers(rendezvousPointAddress)
);

ipcMain.handle('spawn-tor', spawnTor);

ipcMain.handle('stop-tor', stopTor);

ipcMain.handle('get-swap-logs', (_event, swapId) =>
  getSavedLogsOfSwapId(swapId)
);

export function sendSnackbarAlertToRenderer(
  message: string,
  variant: string,
  autoHideDuration: number | null,
  key: string | null
) {
  function send() {
    logger.debug(
      { message, variant, autoHideDuration, key },
      'Attempting to send snackbar alert to renderer'
    );
    if (mainWindow) {
      if (
        mainWindow.webContents.isDestroyed() ||
        mainWindow.webContents.isLoading()
      ) {
        logger.debug(
          'Main window is loading, waiting for it to finish before sending snackbar alert'
        );
        mainWindow.webContents.once('did-finish-load', () =>
          setTimeout(send, 5000)
        );
      } else {
        logger.debug(
          { message, variant, autoHideDuration, key },
          'Sending snackbar alert to renderer'
        );
        mainWindow?.webContents.send(
          'display-snackbar-alert',
          message,
          variant,
          autoHideDuration,
          key
        );
      }
    } else {
      setTimeout(send, 1000);
    }
  }
  send();
}
