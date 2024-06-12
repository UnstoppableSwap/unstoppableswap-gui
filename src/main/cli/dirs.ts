import { app } from 'electron';
import path from 'path';
import { constants, promises as fs } from 'fs';
import { chmod, stat } from 'fs/promises';
import { uniqBy } from 'lodash';
import { store } from 'main/store/mainStore';
import { getPlatform, isTestnet } from 'store/config';
import { Binary } from 'models/downloaderModel';
import { CliLog, getCliLogSpanSwapId } from 'models/cliModel';
import { getLogsFromRawFileString } from 'utils/parseUtils';
import { RpcProcessStateType } from 'models/rpcModel';

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

export async function getCliLogFile(): Promise<string> {
  const logsDir = await getCliLogsDir();
  return path.join(logsDir, `swap-all.log`);
}

export async function getLegacyCliLogFile(swapId: string): Promise<string> {
  const logsDir = await getCliLogsDir();
  return path.join(logsDir, `swap-${swapId}.log`);
}

export function getSwapBinary(): Binary {
  if (process.env.OVERWRITE_SWAP_BINARY_LOCATION && isTestnet()) {
    return {
      fileName: path.basename(process.env.OVERWRITE_SWAP_BINARY_LOCATION),
      dirPath: path.dirname(process.env.OVERWRITE_SWAP_BINARY_LOCATION),
    };
  }

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
    return await fs.readFile(file, {
      encoding: 'utf8',
    });
  } catch (e) {
    throw new Error(`Failed to read file! Path: ${file} Error: ${e}`);
  }
}

export default async function getSavedLogsOfSwapId(
  swapId: string
): Promise<CliLog[]> {
  const logsFile = await getCliLogFile();
  const fileData = await getFileData(logsFile);

  /*
  The CLI used to write logs to a file per swapId.
  This function will read the old logs file if it exists and also take it into account.
   */
  const legacyLogsFile = await getLegacyCliLogFile(swapId);
  const legacyFileData = await getFileData(legacyLogsFile).catch(() => '');

  const legacyLogs = getLogsFromRawFileString(legacyFileData);
  const logs = getLogsFromRawFileString(fileData).filter((log) => {
    return getCliLogSpanSwapId(log) === swapId;
  });

  const rpcProcess = store.getState().rpc.process;
  const currentProcessLogs =
    rpcProcess.type === RpcProcessStateType.NOT_STARTED ? [] : rpcProcess.logs;

  const rpcProcessLogs = currentProcessLogs.filter((log): log is CliLog => {
    return typeof log !== 'string' && getCliLogSpanSwapId(log) === swapId;
  });

  const allLogs = [...legacyLogs, ...logs, ...rpcProcessLogs];
  const allLogsWithoutDuplicates = uniqBy(
    allLogs,
    (log) => log.timestamp + log.fields.message
  );
  return allLogsWithoutDuplicates;
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
