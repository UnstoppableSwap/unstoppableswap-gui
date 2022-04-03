import fs from 'fs';
import { merge } from 'lodash';
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import {
  DbState,
  MergedDbState,
  getTypeOfDbState,
  isExecutionSetupDoneDbState,
  isMergedDbState,
} from '../../models/databaseModel';
import { store } from '../../store/store';
import { databaseStateChanged } from '../../store/features/historySlice';
import { Provider } from '../../models/storeModel';
import { isTestnet } from '../../store/config';
import { getSqliteDbFiles } from './dirs';
import { parseDateString, parseStateString } from '../../utils/parseUtils';
import logger from '../../utils/logger';

async function getAllStatesForSwap(
  db: Database,
  swapId: string
): Promise<DbState[]> {
  type ResponseFormat = {
    state: string;
  }[];

  const response = (await db.all(
    `SELECT state
    FROM swap_states
    WHERE swap_id = ?
    ORDER BY id ASC;`,
    [swapId]
  )) as ResponseFormat;

  return response.map(({ state }) => parseStateString(state));
}

async function getFirstEnteredDateForSwap(
  db: Database,
  swapId: string
): Promise<number> {
  type ResponseFormat = {
    entered_at: string;
  };

  const response = (await db.get(
    `SELECT entered_at
    FROM swap_states
    WHERE swap_id = ? AND id = (
        SELECT min(id)
        FROM swap_states
        WHERE swap_id = ?
    )`,
    [swapId, swapId]
  )) as ResponseFormat;

  return parseDateString(response.entered_at);
}

async function getDistinctSwapIds(db: Database): Promise<string[]> {
  type ResponseFormat = {
    swap_id: string;
  }[];

  const response = (await db.all(
    'SELECT DISTINCT swap_id FROM swap_states'
  )) as ResponseFormat;

  return response.map(({ swap_id }) => swap_id);
}

async function getProviderForSwap(
  db: Database,
  swapId: string
): Promise<Provider> {
  type ResponseFormat = {
    swap_id: string;
    peer_id: string;
    address: string;
  };

  const response = (await db.get(
    'SELECT DISTINCT peers.swap_id, peers.peer_id, peer_addresses.address ' +
      'FROM peers ' +
      'JOIN peer_addresses on peer_addresses.peer_id = peers.peer_id ' +
      'WHERE swap_id = ?;',
    [swapId]
  )) as ResponseFormat;

  return {
    peerId: response.peer_id,
    multiAddr: response.address,
    testnet: isTestnet(),
  };
}

async function getMergedStateForEachSwap(
  db: Database
): Promise<MergedDbState[]> {
  const distinctSwapIds = await getDistinctSwapIds(db);

  return (
    await Promise.all(
      distinctSwapIds.map(async (swapId) => {
        const states = await getAllStatesForSwap(db, swapId);
        const firstEnteredDate = await getFirstEnteredDateForSwap(db, swapId);
        const latestState = states.at(-1);

        if (latestState) {
          const latestStateType = getTypeOfDbState(latestState);
          const mergedState = merge({}, ...states);
          const provider = await getProviderForSwap(db, swapId);

          if (isExecutionSetupDoneDbState(mergedState)) {
            return {
              swapId,
              type: latestStateType,
              state: mergedState,
              provider,
              firstEnteredDate,
            };
          }
        }
        logger.error(
          { swapId },
          `There is no execution setup done state saved for swap. Database might be corrupted!`
        );
        return null;
      })
    )
  )
    .filter(isMergedDbState)
    .sort((a, b) => (a.firstEnteredDate > b.firstEnteredDate ? -1 : 1));
}

let database: Database | null = null;

export async function readFromDatabaseAndUpdateState() {
  const id = Math.random();
  console.time(`read database ${id}`);
  try {
    if (!database) {
      const { primaryFile } = await getSqliteDbFiles();

      database = await open({
        filename: primaryFile,
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_READONLY,
      });
    }

    const states = await getMergedStateForEachSwap(database);
    store.dispatch(databaseStateChanged(states));
  } catch (e) {
    logger.error({ error: (e as Error).toString() }, `Failed to read database`);
  }
  console.timeEnd(`read database ${id}`);
}

export default async function watchDatabase() {
  const { primaryFile, walFile, shmFile } = await getSqliteDbFiles();

  function watchFiles() {
    [primaryFile, walFile, shmFile].forEach((file) => {
      fs.watchFile(file, readFromDatabaseAndUpdateState);
      logger.info({ file }, `Watching database file`);
    });
  }

  await readFromDatabaseAndUpdateState();
  watchFiles();
}
