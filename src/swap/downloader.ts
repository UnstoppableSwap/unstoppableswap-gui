import path from 'path';
import { PathLike, promises as fs } from 'fs';
import download from 'download';
import { checkFileExists } from './utils/file-utils';
import { getFileSha256Sum } from './utils/crypto-utils';

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
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.8.3/swap_0.8.3_Darwin_x86_64.tar',
        sha256sum:
          '13949ca45a7919d2ded13570f614df305e4dff61bb7e2e6c39203bcc0cabc23a',
        name: 'swap',
      };
    case 'linux':
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.8.3/swap_0.8.3_Linux_x86_64.tar',
        sha256sum:
          '9e080161ecc5664e3794a0139932eae23479b2d97d49ec4d7146ff789b345053',
        name: 'swap',
      };
    default:
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.8.3/swap_0.8.3_Windows_x86_64.zip',
        sha256sum:
          '39a0e8f01d06647a9b24208202b1290305980d0dedeb0c2bbc560dc34b896835',
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
