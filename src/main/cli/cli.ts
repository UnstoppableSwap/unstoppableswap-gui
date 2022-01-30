import {
  ChildProcessWithoutNullStreams,
  spawn as spawnProc,
} from 'child_process';
import PQueue from 'p-queue';
import pidtree from 'pidtree';
import { isTestnet } from '../../store/config';
import { isCliLog, CliLog } from '../../models/cliModel';
import { getCliDataBaseDir, getSwapBinary } from './dirs';
import { readFromDatabaseAndUpdateState } from './database';

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
    childrenPids.forEach((childPid) => process.kill(childPid));
    process.kill(rootPid);
    console.log(
      `Force killed cli with root pid ${rootPid} and child pids ${childrenPids}`
    );
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
                  console.log(
                    `Spawned CLI Arguments: ${cli.spawnargs.join(
                      ' '
                    )} in folder ${binary.dirPath} with PID ${cli.pid}`
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
                console.log(
                  `[${subCommand}] CLI excited with code: ${code} and signal: ${signal}`
                );

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
                    .map((logText: string) => {
                      console.log(`[${subCommand}] ${logText.trim()}`);

                      try {
                        const log = JSON.parse(logText);
                        if (isCliLog(log)) {
                          return log;
                        }
                        throw new Error('Required properties are missing');
                      } catch (e) {
                        console.log(
                          `[${subCommand}] Failed to parse cli log. Log text: ${logText} Error: ${e}`
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
