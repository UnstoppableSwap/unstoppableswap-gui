import { ipcMain } from 'electron';
import { stopCli } from './cli/cli';
import spawnBalanceCheck from './cli/commands/balanceCommand';
import { resumeBuyXmr, spawnBuyXmr } from './cli/commands/buyXmrCommand';
import spawnCancelRefund from './cli/commands/cancelRefundCommand';
import spawnWithdrawBtc from './cli/commands/withdrawBtcCommand';
import spawnListSellersCommand from './cli/commands/listSellersCommand';
import { getCliLogFile } from './cli/dirs';
import { spawnTor, stopTor } from './tor';
import logger from '../utils/logger';
import { mainWindow } from './main';

export default function registerIpcHandlers() {
  ipcMain.handle('stop-cli', stopCli);

  ipcMain.handle('spawn-balance-check', spawnBalanceCheck);

  ipcMain.handle(
    'spawn-buy-xmr',
    (_event, provider, redeemAddress, refundAddress) =>
      spawnBuyXmr(provider, redeemAddress, refundAddress)
  );

  ipcMain.handle('resume-buy-xmr', (_event, swapId) => resumeBuyXmr(swapId));

  ipcMain.handle('spawn-cancel-refund', (_event, swapId) =>
    spawnCancelRefund(swapId)
  );

  ipcMain.handle('spawn-withdraw-btc', (_event, address) =>
    spawnWithdrawBtc(address)
  );

  ipcMain.handle('spawn-list-sellers', (_event, rendezvousPointAddress) =>
    spawnListSellersCommand(rendezvousPointAddress)
  );

  ipcMain.handle('get-cli-log-path', (_event, swapId) => getCliLogFile(swapId));

  ipcMain.handle('spawn-tor', spawnTor);

  ipcMain.handle('stop-tor', stopTor);
}

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
