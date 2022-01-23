import { app } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import { getPlatform, isTestnet } from '../../store/config';
import { BinaryInfo } from '../../models/downloaderModel';

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

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

export async function getCliLogFile(swapId: string): Promise<string> {
  const baseDir = await getCliDataDir();
  const logsDir = path.join(baseDir, 'logs');
  await fs.mkdir(logsDir, {
    recursive: true,
  });
  return path.join(logsDir, `swap-${swapId}.log`);
}

export async function getSqliteDbFiles() {
  const cliDataDir = await getCliDataDir();

  const primary = path.join(cliDataDir, 'sqlite');
  const shm = path.join(cliDataDir, 'sqlite-shm');
  const wal = path.join(cliDataDir, 'sqlite-wal');

  return {
    folder: cliDataDir,
    primaryFile: primary,
    shmFile: shm,
    walFile: wal,
  };
}

export function getSwapBinary(): BinaryInfo {
  const platform = getPlatform();
  const dirPath = path.join(RESOURCES_PATH, 'bin', platform);

  switch (getPlatform()) {
    case 'mac':
      return {
        dirPath,
        fileName: 'swap',
      };
    case 'linux':
      return {
        dirPath,
        fileName: 'swap',
      };
    case 'win':
    default:
      return {
        dirPath,
        fileName: 'swap.exe',
      };
  }
}
