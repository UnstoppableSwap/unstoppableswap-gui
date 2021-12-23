import { app } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import { isTestnet } from '../../store/config';

export async function getAppDataDir(): Promise<string> {
  const appDataPath = app.getPath('appData');
  const dPath = path.join(appDataPath, 'unstoppableswap');
  await fs.mkdir(dPath, {
    recursive: true,
  });
  return dPath;
}

export async function getCliDataBaseDir(): Promise<string> {
  const appDataPath = app.getPath('appData');
  const dPath = path.join(appDataPath, 'xmr-btc-swap', 'cli');
  await fs.mkdir(dPath, {
    recursive: true,
  });
  return dPath;
}

export async function getCliDataDir(): Promise<string> {
  const baseDir = await getCliDataBaseDir();
  const dataDir = path.join(baseDir, isTestnet() ? 'testnet' : 'mainnet');
  await fs.mkdir(dataDir, {
    recursive: true,
  });
  return dataDir;
}

export async function getSwapLogFile(swapId: string): Promise<string> {
  const baseDir = await getCliDataDir();
  const logsDir = path.join(baseDir, 'logs');
  await fs.mkdir(logsDir, {
    recursive: true,
  });
  return path.join(logsDir, `swap-${swapId}.logs`);
}
