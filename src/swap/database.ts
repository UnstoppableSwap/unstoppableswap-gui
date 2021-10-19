import path from 'path';
import Database, { Database as DatabaseT } from 'better-sqlite3';
import fs from 'fs';
import { merge } from 'lodash';
import { getCliDataDir } from './cli';
import { checkFileExists } from './utils/file-utils';
import {
  DbState,
  MergedDbState,
  getTypeOfDbState,
  ExecutionSetupDoneDbState,
} from '../models/databaseModel';
import { store } from '../store/store';
import { databaseStateChanged } from '../store/features/swap/historySlice';

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

  return parseStateString(
    (
      db
        .prepare('SELECT max(id), state FROM swap_states WHERE swap_id = ?;')
        .get([swapId]) as ResponseFormat
    ).state
  );
}

function getMergedStateForEachSwap(db: DatabaseT): MergedDbState[] {
  return getDistinctSwapIds(db).map((swapId) => {
    const states = getAllStatesForSwap(db, swapId);
    const latestState = getLatestStateForSwap(db, swapId);
    const latestStateType = getTypeOfDbState(latestState);
    const mergedState = merge({}, ...states);

    return {
      swapId,
      type: latestStateType,
      state: mergedState as ExecutionSetupDoneDbState,
    };
  });
}

export default async function watchDatabase() {
  const { primaryFile, walFile } = await getSqliteDbFiles();

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

  async function watchFiles() {
    if (
      (await checkFileExists(walFile)) &&
      (await checkFileExists(primaryFile))
    ) {
      try {
        fs.watch(primaryFile, readFromDatabaseAndUpdateState);
        fs.watch(walFile, readFromDatabaseAndUpdateState);
        readFromDatabaseAndUpdateState();

        console.log(
          `Started watching database files ${walFile}, ${primaryFile}`
        );

        return;
      } catch (e) {
        console.error(
          `Failed to watch database files ${walFile}, ${primaryFile} even though they exist`
        );
      }
    }
    setTimeout(watchFiles, 1000);
  }

  watchFiles();
}
