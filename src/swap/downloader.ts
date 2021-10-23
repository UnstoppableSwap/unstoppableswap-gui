import path from 'path';
import { PathLike, promises as fs } from 'fs';
import download from 'download';
import { checkFileExists, getFileSha256Sum } from '../utils/fileUtils';

export interface BinaryInfo {
  url: string;
  sha256sum: string;
  name: string;
}

export interface BinaryDownloadStatus {
  totalDownloadedBytes: number;
  contentLengthBytes: number;
  binaryInfo: BinaryInfo;
}

function getSwapBinaryInfo(): BinaryInfo {
  switch (process.platform) {
    case 'darwin':
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.9.0/swap_0.9.0_Darwin_x86_64.tar',
        sha256sum:
          '809ea13b4e9f8dfe9288b22394ae906161161c0763d1e453c81e60ee22cea3d7',
        name: 'swap',
      };
    case 'linux':
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.9.0/swap_0.9.0_Linux_x86_64.tar',
        sha256sum:
          'edb4c182004896ca49bb8458bc9527efd5d487dcdf9ad91398bb60be9b70f099',
        name: 'swap',
      };
    default:
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.9.0/swap_0.9.0_Windows_x86_64.zip',
        sha256sum:
          '3f2ade3e5ba1bb1522f070dd7896903a73e605a3507eaa35f69c92bb9b172ec9',
        name: 'swap.exe',
      };
  }
}

export default async function downloadSwapBinary(
  appDataDir: PathLike,
  downloadProgressCallback: (status: BinaryDownloadStatus) => void
): Promise<BinaryInfo> {
  const binaryInfo = getSwapBinaryInfo();
  const binaryPath = path.join(appDataDir.toString(), binaryInfo.name);

  if (await checkFileExists(binaryPath)) {
    const checksum = await getFileSha256Sum(binaryPath);
    if (checksum === binaryInfo.sha256sum) {
      return binaryInfo;
    }
    await fs.unlink(binaryPath);
  }

  console.log(
    `Downloading ${binaryInfo.name} from ${binaryInfo.url} to ${appDataDir}`
  );

  await download(binaryInfo.url, appDataDir.toString(), {
    extract: true,
  }).on('response', (res) => {
    const contentLengthBytesStr = res.headers['content-length'];

    if (contentLengthBytesStr != null) {
      const contentLengthBytes = Number.parseInt(contentLengthBytesStr, 10);
      let totalDownloadedBytes = 0;

      res.on('data', (data) => {
        const dataLength = data.length;
        totalDownloadedBytes += dataLength;

        downloadProgressCallback({
          binaryInfo,
          contentLengthBytes,
          totalDownloadedBytes,
        });
      });
    }
  });

  if (await checkFileExists(binaryPath)) {
    const checksum = await getFileSha256Sum(binaryPath);
    if (checksum === binaryInfo.sha256sum) {
      return binaryInfo;
    }

    await fs.unlink(binaryPath);
    throw new Error(
      `Downloaded swap binary does not match the expected checksum Received: ${checksum} Expected: ${binaryInfo.sha256sum}`
    );
  }

  throw new Error(
    `Extracted downloaded swap binary archive did not contain file with appropriate name Expected Filename: ${binaryInfo.name}`
  );
}
