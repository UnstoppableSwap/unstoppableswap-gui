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
import { app, BrowserWindow, shell } from 'electron';
import blocked from 'blocked-at';
import { resolveHtmlPath } from './util';
import { stopCli } from './cli/cli';
import spawnBalanceCheck from './cli/commands/balanceCommand';
import watchDatabase from './cli/database';
import { getPlatform, isDevelopment } from '../store/config';
import { getAssetPath, fixAppDataPath } from './cli/dirs';
import initSocket from './socket';
import logger from '../utils/logger';
import watchElectrumTransactions from './blockchain/electrum';
import watchLogs from './cli/log';
import { stopTor } from './tor';
import initAutoUpdater from './updater';
import initStats from './stats';
import registerIpcHandlers from './ipc';

let mainWindow: BrowserWindow | null = null;

export function getMainWindow() {
  return mainWindow;
}

async function installExtensions() {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch((err: any) =>
      logger.error({ err }, 'Failed to install browser extensions')
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
    height: 808,
    minHeight: 808,
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

  mainWindow.loadURL(resolveHtmlPath('index.html'), {
    userAgent: `UnstoppableSwap GUI/${app.getVersion()}`,
  });

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

  await initAutoUpdater(mainWindow);
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
      registerIpcHandlers();
      initSocket();
      watchDatabase();
      spawnBalanceCheck();
      watchElectrumTransactions();
      watchLogs();
      initStats();
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
