import path from 'path';
import Database, { Database as DatabaseT } from 'better-sqlite3';
import fs from 'fs';
import { getCliDataDir } from './cli';
import { checkFileExists } from './utils/file-utils';
import { AnyDbState, EncapsulatedDbState } from '../models/database';
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

function getLatestStateForEachSwap(db: DatabaseT): EncapsulatedDbState[] {
  return db
    .prepare(
      'SELECT max(id), state, swap_id ' +
        'FROM swap_states ' +
        'GROUP BY swap_id;'
    )
    .all()
    .map(({ swap_id, state }) => ({
      swap_id: swap_id as string,
      state: JSON.parse(state) as AnyDbState,
    }));
}

export default async function watchDatabase() {
  const { primaryFile, walFile } = await getSqliteDbFiles();

  function readFromDatabaseAndUpdateState() {
    try {
      const db = new Database(primaryFile, {
        readonly: true,
      });

      const states = getLatestStateForEachSwap(db);
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
