import { isNumber } from 'lodash';

export interface BinaryInfo {
  url: string;
  sha256sum: string;
  name: string;
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
