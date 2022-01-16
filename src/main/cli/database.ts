import fs from 'fs';
import { merge } from 'lodash';
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import {
  DbState,
  MergedDbState,
  getTypeOfDbState,
  isExecutionSetupDoneDbState,
  isDbState,
  isMergedDbState,
} from '../../models/databaseModel';
import { store } from '../../store/store';
import { databaseStateChanged } from '../../store/features/historySlice';
import { Provider } from '../../models/storeModel';
import { isTestnet } from '../../store/config';
import { getSqliteDbFiles } from './dirs';

function parseStateString(str: string): DbState {
  const dbState = JSON.parse(str) as DbState;
  if (isDbState(dbState)) {
    return dbState;
  }
  throw new Error(`State string is not a valid db state: ${str}`);
}

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
            };
          }
        }
        console.error(
          `There is no execution setup done state saved for swap ${swapId}. Database might be corrupted!`
        );
        return null;
      })
    )
  ).filter(isMergedDbState);
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
    console.error(`Failed to read database Error: ${e}`);
  }
  console.timeEnd(`read database ${id}`);
}

export default async function watchDatabase() {
  const { primaryFile, walFile, shmFile } = await getSqliteDbFiles();

  function watchFiles() {
    [primaryFile, walFile, shmFile].forEach((file) => {
      fs.watchFile(file, readFromDatabaseAndUpdateState);
      console.log(`Watching database file ${file}`);
    });
  }

  await readFromDatabaseAndUpdateState();
  watchFiles();
}
