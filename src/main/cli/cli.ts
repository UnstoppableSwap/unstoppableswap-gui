import path from 'path';
import { promises as fs } from 'fs';
import { app } from 'electron';
import {
  ChildProcessWithoutNullStreams,
  spawn as spawnProc,
} from 'child_process';
import psList from 'ps-list';
import downloadSwapBinary, { BinaryDownloadStatus } from './downloader';
import { isTestnet } from '../../store/config';
import { isSwapLog, SwapLog } from '../../models/swapModel';

let cli: ChildProcessWithoutNullStreams | null = null;

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

async function getSpawnArgs(
  subCommand: string,
  options: { [option: string]: string }
): Promise<string[]> {
  const cliAppDataDir = await getCliDataBaseDir();

  const flagsArray = isTestnet()
    ? ['--json', '--debug', '--testnet', '--data-base-dir', cliAppDataDir]
    : ['--json', '--debug', '--data-base-dir', cliAppDataDir];

  const optionsArray: Array<string> = [];
  Object.entries(options).forEach(([key, value]) => {
    optionsArray.push(`--${key}`);
    optionsArray.push(value);
  });

  return [...flagsArray, subCommand, ...optionsArray];
}

async function killMoneroWalletRpc() {
  const list = await psList();
  const pid = list.find(
    (p) =>
      p.name.match(/monero(.*)wallet(.*)rpc/gim) ||
      p.cmd?.match(/monero(.*)wallet(.*)rpc/gim)
  )?.pid;

  if (pid) {
    const moneroWalletRpcKillErorr = process.kill(pid);

    if (moneroWalletRpcKillErorr) {
      console.error(
        `Failed to kill monero-wallet-rpc PID: ${pid} Error: ${moneroWalletRpcKillErorr}`
      );
    } else {
      console.debug(`Successfully monero-wallet-rpc killed PID: ${pid}`);
    }
  } else {
    console.debug(
      `monero-wallet-rpc was not killed because process could not be found`
    );
  }
}

export async function stopCli() {
  cli?.kill('SIGINT');
}

export async function spawnSubcommand(
  subCommand: string,
  options: { [option: string]: string },
  downloadProgressCallback: (status: BinaryDownloadStatus) => void,
  onLog: (log: SwapLog) => void,
  onExit: (code: number | null, signal: NodeJS.Signals | null) => void,
  onStdOut: (data: string) => void
) {
  if (cli) {
    throw new Error(
      `Can't spawn cli with subcommand ${subCommand} because other cli process is running Arguments: ${cli.spawnargs.join(
        ' '
      )}`
    );
  }
  const appDataPath = await getAppDataDir();
  const binaryInfo = await downloadSwapBinary(
    appDataPath,
    downloadProgressCallback
  );
  const spawnArgs = await getSpawnArgs(subCommand, options);

  await killMoneroWalletRpc();
  cli = spawnProc(`./${binaryInfo.name}`, spawnArgs, {
    cwd: appDataPath,
  });

  console.log(`Spawned cli Arguments: ${cli.spawnargs.join(' ')}`);

  [cli.stderr, cli.stdout].forEach((stream) => {
    stream.setEncoding('utf8');
    stream.on('data', (data) => {
      onStdOut(data);

      data
        .toString()
        .split(/(\r?\n)/g)
        .filter((s: string) => s.length > 3)
        .forEach((logText: string) => {
          try {
            const log = JSON.parse(logText);
            if (isSwapLog(log)) {
              onLog(log);
            } else {
              throw new Error('Required properties are missing');
            }
          } catch (e) {
            console.debug(
              `Failed to parse proc log. Log text: ${logText} Error: ${e.message}`
            );
          }
        });
    });
  });

  cli.on('exit', async (code, signal) => {
    console.log(`Cli excited Code: ${code} Signal: ${signal}`);

    await killMoneroWalletRpc();
    cli = null;

    onExit(code, signal);
  });

  return cli;
}
