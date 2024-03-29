import { app } from 'electron';
import path from 'path';
import { constants, promises as fs } from 'fs';
import { chmod, stat } from 'fs/promises';
import { getPlatform, isTestnet } from '../../store/config';
import { Binary } from '../../models/downloaderModel';

// Be consistent with the way the cli generates the
// data-dir on linux
// See https://docs.rs/directories-next/2.0.0/directories_next/struct.ProjectDirs.html#method.data_dir
export function fixAppDataPath() {
  if (getPlatform() === 'linux') {
    const dir =
      process.env.XDG_CONFIG_HOME ||
      path.join(app.getPath('home'), '.local', 'share');
    app.setPath('appData', dir);
  }
}

export const ASSETS_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

export const BINARIES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'bin')
  : path.join(__dirname, '../../../build/bin');

export function getAssetPath(...paths: string[]): string {
  return path.join(ASSETS_PATH, ...paths);
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

export async function getCliLogsDir(): Promise<string> {
  const baseDir = await getCliDataDir();
  const logsDir = path.join(baseDir, 'logs');
  await fs.mkdir(logsDir, {
    recursive: true,
  });
  return logsDir;
}

export async function getCliLogFile(swapId: string): Promise<string> {
  const logsDir = await getCliLogsDir();
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

export function getSwapBinary(): Binary {
  const platform = getPlatform();
  const dirPath = app.isPackaged
    ? BINARIES_PATH
    : path.join(BINARIES_PATH, 'swap', platform);

  switch (platform) {
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

export function getTorBinary(): Binary {
  const platform = getPlatform();
  const dirPath = app.isPackaged
    ? BINARIES_PATH
    : path.join(BINARIES_PATH, 'tor', platform);

  switch (platform) {
    case 'mac':
      return {
        dirPath,
        fileName: 'tor',
      };
    case 'linux':
      return {
        dirPath,
        fileName: 'tor',
      };
    case 'win':
    default:
      return {
        dirPath,
        fileName: 'tor.exe',
      };
  }
}

export async function getFileData(file: string): Promise<string> {
  try {
    const prevLogData = await fs.readFile(file, {
      encoding: 'utf8',
    });
    return prevLogData;
  } catch (e) {
    throw new Error(`Failed to read file! Path: ${file} Error: ${e}`);
  }
}

export async function getCliLogStdOut(swapId: string): Promise<string> {
  const logFile = await getCliLogFile(swapId);
  const logData = await getFileData(logFile);
  return logData;
}

export async function makeFileExecutable(binary: Binary) {
  const fullPath = path.join(binary.dirPath, binary.fileName);
  const { mode } = await stat(fullPath);
  await chmod(
    fullPath,
    // eslint-disable-next-line no-bitwise
    mode | constants.S_IXUSR | constants.S_IXGRP | constants.S_IXOTH
  );
}
