import {
  ChildProcessWithoutNullStreams,
  spawn as spawnProc,
} from 'child_process';
import PQueue from 'p-queue';
import pidtree from 'pidtree';
import { isTestnet } from '../../store/config';
import { CliLog, isCliLog } from '../../models/cliModel';
import { getCliDataBaseDir, getSwapBinary } from './dirs';
import { readFromDatabaseAndUpdateState } from './database';
import logger from '../../utils/logger';

const queue = new PQueue({ concurrency: 1 });
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

export async function stopCli() {
  const rootPid = cli?.pid;
  if (rootPid) {
    const childrenPids = await pidtree(rootPid);
    childrenPids.forEach((childPid) => {
      try {
        process.kill(childPid);
      } catch (e) {
        logger.error(
          { pid: childPid, error: (e as Error).toString() },
          `Failed to kill children cli process`
        );
      }
    });
    try {
      process.kill(rootPid);
      logger.error({ rootPid, childrenPids }, `Force killed cli`);
    } catch (e) {
      logger.error(
        { pid: rootPid, error: (e as Error).toString() },
        `Failed to kill root cli process`
      );
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
                  await readFromDatabaseAndUpdateState();
                } finally {
                  onExit(code, signal);
                  resolveRunning();
                }
              });

              [cli.stderr, cli.stdout].forEach((stream) => {
                stream.setEncoding('utf8');
                stream.on('data', (data: string) => {
                  onStdOut(data);

                  const logs = data
                    .toString()
                    .split(/(\r?\n)/g)
                    .filter((s) => s.length > 2)
                    .map((logText) => {
                      logger.debug(
                        { subCommand, logText: logText.trim() },
                        'Received stdout from cli process'
                      );

                      try {
                        return JSON.parse(logText);
                      } catch (e) {
                        logger.debug(
                          {
                            subCommand,
                            logText,
                            error: (e as Error).toString(),
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
