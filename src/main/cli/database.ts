import path from 'path';
import Database, { Database as DatabaseT } from 'better-sqlite3';
import fs from 'fs';
import { merge } from 'lodash';
import {
  DbState,
  MergedDbState,
  getTypeOfDbState,
  isExecutionSetupDoneDbState,
} from '../../models/databaseModel';
import { store } from '../../store/store';
import { databaseStateChanged } from '../../store/features/historySlice';
import { Provider } from '../../models/storeModel';
import { isTestnet } from '../../store/config';
import { getCliDataDir } from './dirs';

async function getSqliteDbFiles() {
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

function parseStateString(str: string): DbState {
  return JSON.parse(str) as DbState;
}

function getAllStatesForSwap(db: DatabaseT, swapId: string): DbState[] {
  return db
    .prepare('SELECT state FROM swap_states WHERE swap_id = ?;')
    .all([swapId])
    .map(({ state }) => parseStateString(state));
}

function getDistinctSwapIds(db: DatabaseT): string[] {
  type ResponseFormat = {
    swap_id: string;
  }[];

  return (
    db
      .prepare('SELECT DISTINCT swap_id FROM swap_states')
      .all() as ResponseFormat
  ).map(({ swap_id }) => swap_id);
}

function getLatestStateForSwap(db: DatabaseT, swapId: string): DbState {
  type ResponseFormat = {
    id: number;
    state: string;
  };

  const response = db
    .prepare(`SELECT max(id), state FROM swap_states WHERE swap_id = ?;`)
    .get([swapId]) as ResponseFormat;

  const state = parseStateString(response.state);

  return state;
}

function getProviderForSwap(db: DatabaseT, swapId: string): Provider {
  type ResponseFormat = {
    swap_id: string;
    peer_id: string;
    address: string;
  };

  const response = db
    .prepare(
      'SELECT DISTINCT peers.swap_id, peers.peer_id, peer_addresses.address ' +
        'FROM peers ' +
        'JOIN peer_addresses on peer_addresses.peer_id = peers.peer_id ' +
        'WHERE swap_id = ?;'
    )
    .get([swapId]) as ResponseFormat;

  return {
    peerId: response.peer_id,
    multiAddr: response.address,
    testnet: isTestnet(),
  };
}

function getMergedStateForEachSwap(db: DatabaseT): MergedDbState[] {
  return getDistinctSwapIds(db)
    .map((swapId) => {
      const states = getAllStatesForSwap(db, swapId);
      const latestState = getLatestStateForSwap(db, swapId);
      const latestStateType = getTypeOfDbState(latestState);
      const mergedState = merge({}, ...states);
      const provider = getProviderForSwap(db, swapId);

      if (isExecutionSetupDoneDbState(mergedState)) {
        return {
          swapId,
          type: latestStateType,
          state: mergedState,
          provider,
        };
      }
      console.error(
        `There is no execution setup done state saved for swap ${swapId}. Removing from store, database might be corrupted!`
      );
      return null;
    })
    .filter((s): s is MergedDbState => s !== null);
}

export default async function watchDatabase() {
  const { primaryFile, walFile, shmFile } = await getSqliteDbFiles();

  function readFromDatabaseAndUpdateState() {
    try {
      const db = new Database(primaryFile, {
        readonly: true,
      });

      const states = getMergedStateForEachSwap(db);
      store.dispatch(databaseStateChanged(states));
    } catch (e) {
      console.error(`Failed to read database Error: ${e}`);
    }
  }

  function watchFiles() {
    [primaryFile, walFile, shmFile].forEach((file) => {
      fs.watchFile(file, readFromDatabaseAndUpdateState);
      console.log(`Watching database file ${file}`);
    });
  }

  readFromDatabaseAndUpdateState();
  watchFiles();
}
