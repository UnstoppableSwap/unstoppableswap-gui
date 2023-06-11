import { store } from '../../../store/store';
import { spawnSubcommand } from '../cli';
import { CliLog } from '../../../models/cliModel';
import logger from '../../../utils/logger';
import {
  listSellersAddLog,
  listSellersAppendStdOut,
  listSellersInitiate,
  listSellersProcessExited,
} from '../../../store/features/providersSlice';

function onProcExit(code: number | null, signal: NodeJS.Signals | null) {
  store.dispatch(
    listSellersProcessExited({
      exitCode: code,
      exitSignal: signal,
    })
  );
}

function onStdOut(data: string) {
  store.dispatch(listSellersAppendStdOut(data));
}

function onAddLog(data: CliLog) {
  store.dispatch(listSellersAddLog(data));
}

export default async function spawnListSellersCommand(
  rendezvousPointAddress: string
) {
  try {
    store.dispatch(listSellersInitiate());

    await spawnSubcommand(
      'list-sellers',
      {
        'rendezvous-point': rendezvousPointAddress,
      },
      (logs) => logs.forEach(onAddLog),
      onProcExit,
      onStdOut
    );
  } catch (err) {
    logger.error({ err }, `Failed to spawn list-sellers command`);
    onProcExit(null, null);
  }
}
