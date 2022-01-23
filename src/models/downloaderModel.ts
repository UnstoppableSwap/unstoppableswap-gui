import { isNumber } from 'lodash';

export interface BinaryInfo {
  dirPath: string; // Path without filename appended
  fileName: string;
}

export interface BinaryDownloadStatus {
  totalDownloadedBytes: number;
  contentLengthBytes: number;
  binary: BinaryInfo;
}

export function isBinaryDownloadStatus(
  status: BinaryDownloadStatus | null | undefined
): status is BinaryDownloadStatus {
  return (
    isNumber(status?.contentLengthBytes) &&
    isNumber(status?.totalDownloadedBytes) &&
    status?.binary !== null
  );
}
