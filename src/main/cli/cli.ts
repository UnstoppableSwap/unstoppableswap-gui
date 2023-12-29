import {
  ChildProcessWithoutNullStreams,
  spawn as spawnProc,
  exec,
} from 'child_process';
import PQueue from 'p-queue';
import pidtree from 'pidtree';
import util from 'util';
import { getPlatform, isTestnet } from '../../store/config';
import { CliLog, isCliLog } from '../../models/cliModel';
import { getCliDataBaseDir, getSwapBinary, makeFileExecutable } from './dirs';
import { readFromDatabaseAndUpdateState } from './database';
import logger from '../../utils/logger';
import { getLinesOfString } from '../../utils/parseUtils';

const queue = new PQueue({ concurrency: 1 });
let cli: ChildProcessWithoutNullStreams | null = null;

async function attemptKillMoneroWalletRpcProcess() {
  if (process.env.SKIP_MONERO_WALLET_RPC_KILL === 'true') {
    logger.debug('Skipping monero-wallet-rpc kill');
    return;
  }

  const WIN_COMMAND = `powershell.exe "Get-Process | Where-Object {$_.Path -like '*monero-wallet-rpc*'} | Stop-Process -Force"`;
  const UNIX_COMMAND = `ps aux | grep 'monero-wallet-rpc' | grep -v 'grep' | awk '{print $2}' | xargs kill -9`;

  const command = getPlatform() === 'win' ? WIN_COMMAND : UNIX_COMMAND;

  try {
    const { stderr, stdout } = await util.promisify(exec)(command);
    logger.debug(
      { stderr, stdout },
      'Attempted to kill monero-wallet-rpc using command'
    );
  } catch (e) {
    logger.error(
      { e },
      'Attempted monero-wallet-rpc kill using command failed'
    );
  }
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

export async function stopCli() {
  const rootPid = cli?.pid;
  if (rootPid) {
    const childrenPids = await pidtree(rootPid);
    childrenPids.forEach((childPid) => {
      try {
        process.kill(childPid);
      } catch (err) {
        logger.error(
          { pid: childPid, err },
          `Failed to kill children cli process`
        );
      }
    });
    try {
      process.kill(rootPid);
      logger.info({ rootPid, childrenPids }, `Force killed cli`);
    } catch (err) {
      logger.error({ pid: rootPid, err }, `Failed to kill root cli process`);
    }
  }
}

export async function spawnSubcommand(
  subCommand: string,
  options: { [option: string]: string },
  onLog: (log: CliLog[]) => void,
  onExit: (code: number | null, signal: NodeJS.Signals | null) => void,
  onStdOut: (data: string) => void
): Promise<ChildProcessWithoutNullStreams> {
  /*
  This looks bad, I know
  Two things are happening here:
    - It returns a promise that resolves as soon as the process is spawned
    - and it adds a function to the queue that is called as soon as no other cli process is running and which returns a promise that resolves as soon as the process exits

  This prevents multiple subcommands from being spawned at the same time and causing issues
   */
  return new Promise<ChildProcessWithoutNullStreams>(
    (resolveSpawn, rejectSpawn) => {
      queue.add(
        () =>
          new Promise<void>(async (resolveRunning) => {
            try {
              const spawnArgs = await getSpawnArgs(subCommand, options);
              const binary = getSwapBinary();

              try {
                await makeFileExecutable(binary);
              } catch (err) {
                logger.error(
                  { err, binary },
                  'Failed to make swap binary executable'
                );
              }

              attemptKillMoneroWalletRpcProcess();

              cli = spawnProc(`./${binary.fileName}`, spawnArgs, {
                cwd: binary.dirPath,
              });

              // Added in: Node v15.1.0, v14.17.0
              cli.on('spawn', () => {
                if (cli) {
                  logger.info(
                    {
                      args: cli.spawnargs,
                      cwd: binary.dirPath,
                      pid: cli.pid,
                      subCommand,
                    },
                    'Spawned CLI process'
                  );

                  resolveSpawn(cli);
                }
              });

              cli.on('error', (e) => {
                cli = null;
                rejectSpawn(
                  new Error(
                    `Failed to spawn ${subCommand} Cwd: ${binary.dirPath} Binary: ${binary.fileName} Error: ${e}`
                  )
                );
                resolveRunning();
              });

              cli.on('exit', async (code, signal) => {
                logger.info({ subCommand, code, signal }, `CLI excited`);

                cli = null;

                try {
                  await Promise.all([
                    attemptKillMoneroWalletRpcProcess(),
                    readFromDatabaseAndUpdateState(),
                  ]);
                } finally {
                  onExit(code, signal);
                  resolveRunning();
                }
              });

              [cli.stderr, cli.stdout].forEach((stream) => {
                stream.setEncoding('utf8');
                stream.on('data', (data: string) => {
                  onStdOut(data);

                  const logs = getLinesOfString(data)
                    .map((logText) => {
                      logger.debug(
                        { subCommand, logText: logText.trim() },
                        'Received stdout from cli process'
                      );

                      try {
                        return JSON.parse(logText);
                      } catch (err) {
                        logger.debug(
                          {
                            subCommand,
                            logText,
                            err,
                          },
                          'Failed to parse CLI log'
                        );
                      }
                      return null;
                    })
                    .filter(isCliLog);

                  onLog(logs);

                  readFromDatabaseAndUpdateState();
                });
              });
            } catch (e) {
              rejectSpawn(
                new Error(`Failed to spawn ${subCommand} Error: ${e}`)
              );
              resolveRunning();
            }
          })
      );
    }
  );
}
