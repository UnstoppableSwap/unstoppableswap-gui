import {
  ChildProcessWithoutNullStreams,
  spawn as spawnProc,
} from 'child_process';
import psList from 'ps-list';
import downloadSwapBinary from './downloader';
import { isTestnet } from '../../store/config';
import { isCliLog, CliLog } from '../../models/swapModel';
import { getAppDataDir, getCliDataBaseDir } from './dirs';

let cli: ChildProcessWithoutNullStreams | null = null;

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
    const moneroWalletRpcKillError = process.kill(pid);

    if (moneroWalletRpcKillError) {
      console.error(
        `Failed to kill monero-wallet-rpc PID: ${pid} Error: ${moneroWalletRpcKillError}`
      );
    } else {
      console.debug(`Successfully killed monero-wallet-rpc PID: ${pid}`);
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
  onLog: (log: CliLog) => void,
  onExit: (code: number | null, signal: NodeJS.Signals | null) => void,
  onStdOut: (data: string) => void
): Promise<ChildProcessWithoutNullStreams> {
  if (cli) {
    throw new Error(
      `Can't spawn cli with subcommand ${subCommand} because other cli process is running Arguments: ${cli.spawnargs.join(
        ' '
      )}`
    );
  }
  const appDataPath = await getAppDataDir();
  const binaryInfo = await downloadSwapBinary();
  const spawnArgs = await getSpawnArgs(subCommand, options);

  await killMoneroWalletRpc();

  cli = spawnProc(`./${binaryInfo.name}`, spawnArgs, {
    cwd: appDataPath,
  });

  console.log(
    `Spawned cli Arguments: ${cli.spawnargs.join(' ')} in folder ${appDataPath}`
  );

  [cli.stderr, cli.stdout].forEach((stream) => {
    stream.setEncoding('utf8');
    stream.on('data', (data) => {
      onStdOut(data);

      data
        .toString()
        .split(/(\r?\n)/g)
        .filter((s: string) => s.length > 2)
        .forEach((logText: string) => {
          console.log(`[${subCommand}] ${logText.trim()}`);

          try {
            const log = JSON.parse(logText);
            if (isCliLog(log)) {
              onLog(log);
            } else {
              throw new Error('Required properties are missing');
            }
          } catch (e) {
            console.log(
              `[${subCommand}] Failed to parse cli log. Log text: ${logText} Error: ${e.message}`
            );
          }
        });
    });
  });

  cli.on('exit', async (code, signal) => {
    console.log(
      `[${subCommand}] Cli excited with Code. ${code} and Signal: ${signal}`
    );

    cli = null;
    onExit(code, signal);
  });

  return cli;
}
