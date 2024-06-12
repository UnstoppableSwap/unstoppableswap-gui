import {
  ChildProcessWithoutNullStreams,
  spawn as spawnProc,
  exec,
} from 'child_process';
import PQueue from 'p-queue';
import pidtree from 'pidtree';
import util from 'util';
import { getPlatform, isTestnet } from 'store/config';
import { CliLog, isCliLog } from 'models/cliModel';
import {
  getLogsAndStringsFromRawFileString,
  getLogsFromRawFileString,
} from 'utils/parseUtils';
import { store } from 'main/store/mainStore';
import { swapProcessExited } from 'store/features/swapSlice';
import { RpcProcessStateType } from 'models/rpcModel';
import {
  rpcAddLogs,
  rpcInitiate,
  rpcProcessExited,
} from '../../store/features/rpcSlice';
import logger from '../../utils/logger';
import { getCliDataBaseDir, getSwapBinary, makeFileExecutable } from './dirs';
import {
  checkBitcoinBalance,
  getRawSwapInfos,
  RPC_BIND_HOST,
  RPC_BIND_PORT,
  RPC_LOG_EVENT_EMITTER,
} from './rpc';

const PERIODIC_API_RETRIEVAL_INTERVAL = 1000 * 10;
const BITCOIN_BALANCE_FORCE_REFRESH_INTERVAL = 1000 * 60;

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
      'Attempted to kill monero-wallet-rpc using command',
    );
  } catch (e) {
    logger.error(
      { e },
      'Attempted monero-wallet-rpc kill using command failed',
    );
  }
}

async function getSpawnArgs(
  subCommand: string,
  options: { [option: string]: string },
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
          `Failed to kill children cli process`,
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
  onLog: ((log: (CliLog | string)[]) => unknown) | null,
  onExit: (code: number | null, signal: NodeJS.Signals | null) => void,
  onStdOut: ((data: string) => unknown) | null,
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
                  'Failed to make swap binary executable',
                );
              }

              await attemptKillMoneroWalletRpcProcess();

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
                    'Spawned CLI process',
                  );

                  resolveSpawn(cli);
                }
              });

              cli.on('error', (e) => {
                cli = null;
                rejectSpawn(
                  new Error(
                    `Failed to spawn ${subCommand} Cwd: ${binary.dirPath} Binary: ${binary.fileName} Error: ${e}`,
                  ),
                );
                resolveRunning();
              });

              cli.on('exit', async (code, signal) => {
                logger.info({ subCommand, code, signal }, `CLI excited`);

                try {
                  await attemptKillMoneroWalletRpcProcess();
                } finally {
                  onExit(code, signal);
                  resolveRunning();
                  cli = null;
                }
              });

              [cli.stderr, cli.stdout].forEach((stream) => {
                stream.setEncoding('utf8');
                stream.on('data', (data: string) => {
                  logger.debug({ subCommand, data }, `CLI stdout`);

                  if (onStdOut != null) {
                    onStdOut(data);
                  }

                  if (onLog != null) {
                    const logs = getLogsAndStringsFromRawFileString(data);
                    onLog(logs);
                  }
                });
              });
            } catch (e) {
              rejectSpawn(
                new Error(`Failed to spawn ${subCommand} Error: ${e}`),
              );
              resolveRunning();
            }
          }),
      );
    },
  );
}

export async function startRPC() {
  let isPeriodicRetrievalRunning = false;
  let lastBitcoinBalanceForceCheckTime = Date.now();

  /**
   * Starts the periodic retrieval of swap information and Bitcoin balance.
   *
   * This function initiates an ongoing loop that periodically calls `getRawSwapInfos`
   * to retrieve current swap information and `checkBitcoinBalance` to check the
   * Bitcoin balance. The Bitcoin balance check includes a conditional 'force check'
   * that is triggered at a specified interval, defined by BITCOIN_BALANCE_FORCE_REFRESH_INTERVAL.
   *
   * The loop runs continuously until the `isRunning` flag is set to false, which occurs
   * when the RPC server stops. This ensures that the periodic checks are terminated properly.
   *
   * The initial call to `getRawSwapInfos` and `checkBitcoinBalance` with `forceCheck` set to `true`
   * ensures that both actions are performed immediately when the periodic retrieval starts,
   * without waiting for the first interval to elapse.
   *
   * The `forceCheck` parameter for `checkBitcoinBalance` is set to `true` at intervals defined by
   * BITCOIN_BALANCE_FORCE_REFRESH_INTERVAL. This is controlled by comparing the current time
   * against the timestamp of the last force check (`lastBitcoinBalanceForceCheckTime`).
   *
   */
  const startPeriodicRetrieval = async () => {
    isPeriodicRetrievalRunning = true;
    await getRawSwapInfos();
    await checkBitcoinBalance(true);

    while (isPeriodicRetrievalRunning) {
      // Wait for the next interval before repeating
      await new Promise((resolve) =>
        setTimeout(resolve, PERIODIC_API_RETRIEVAL_INTERVAL),
      );

      await getRawSwapInfos();

      // Check if enough time has elapsed to set forceCheck to true
      const currentTime = Date.now();
      const forceCheck =
        currentTime - lastBitcoinBalanceForceCheckTime >=
        BITCOIN_BALANCE_FORCE_REFRESH_INTERVAL;
      if (forceCheck) {
        lastBitcoinBalanceForceCheckTime = currentTime; // Reset the timer
      }

      await checkBitcoinBalance(forceCheck);
    }
  };

  await spawnSubcommand(
    'start-daemon',
    {
      'server-address': `${RPC_BIND_HOST}:${RPC_BIND_PORT}`,
    },
    async (logs) => {
      RPC_LOG_EVENT_EMITTER.emit(logs.filter(isCliLog));

      store.dispatch(rpcAddLogs(logs));

      const processType = store.getState().rpc.process.type;
      if (
        processType === RpcProcessStateType.LISTENING_FOR_CONNECTIONS &&
        !isPeriodicRetrievalRunning
      ) {
        startPeriodicRetrieval();
      }
    },
    (exitCode, exitSignal) => {
      store.dispatch(rpcProcessExited({ exitCode, exitSignal }));
      store.dispatch(swapProcessExited('RPC Server has stopped'));
      logger.error(`RPC server has stopped with code ${exitCode}`);

      isPeriodicRetrievalRunning = false;
    },
    null,
  );
  store.dispatch(rpcInitiate());
}
