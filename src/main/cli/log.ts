import { getCliLogFile, getFileData } from './dirs';
import { getLogsFromRawFileString } from '../../utils/parseUtils';
import { CliLog } from '../../models/cliModel';

export default async function getSavedLogsOfSwapId(
  swapId: string
): Promise<CliLog[]> {
  const logsFile = await getCliLogFile();
  const fileData = await getFileData(logsFile);
  const allLogs = getLogsFromRawFileString(fileData);

  return allLogs.filter(
    (log) => log.spans?.find((span) => 'swap_id' in span)?.swap_id === swapId
  );
}
