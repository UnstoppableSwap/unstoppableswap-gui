import path from 'path';
import { promises as fs } from 'fs';
import download from 'download';
import { BinaryInfo } from 'models/downloaderModel';
import { checkFileExists, getFileSha256Sum } from '../../utils/fileUtils';
import { store } from '../../store/store';
import {
  cliDownloadEnd,
  cliDownloaderProgressUpdate,
} from '../../store/features/downloaderSlice';
import { getAppDataDir } from './dirs';

function getSwapBinaryInfo(): BinaryInfo {
  switch (process.platform) {
    case 'darwin':
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/preview/swap_preview_Darwin_x86_64.tar',
        sha256sum:
          '8dae4eb615cf8f6a7abec306da097820f1f68f1b863cbe96d3d1e8cde6450835',
        name: 'swap',
      };
    case 'linux':
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/preview/swap_preview_Linux_x86_64.tar',
        sha256sum:
          '1505e8671d2b68038c4d38ada192360be6aa097866eef86afdab6db1454f9b20',
        name: 'swap',
      };
    default:
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/preview/swap_preview_Windows_x86_64.zip',
        sha256sum:
          '29112407a4d87a653e835b9c6f3545540bb79e8225bcfe6be03fda732d843091',
        name: 'swap.exe',
      };
  }
}

let locked = false;

export default async function downloadSwapBinary(): Promise<BinaryInfo> {
  const appDataDir = await getAppDataDir();
  const binaryInfo = getSwapBinaryInfo();
  const binaryPath = path.join(appDataDir.toString(), binaryInfo.name);

  try {
    if (locked) throw new Error('Downloader has already been initiated');
    locked = true;

    if (await checkFileExists(binaryPath)) {
      const sha256sum = await getFileSha256Sum(binaryPath);
      if (sha256sum === binaryInfo.sha256sum) {
        locked = false;
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

          store.dispatch(
            cliDownloaderProgressUpdate({
              binary: binaryInfo,
              contentLengthBytes,
              totalDownloadedBytes,
            })
          );
        });
      }
    });

    if (await checkFileExists(binaryPath)) {
      const sha256sum = await getFileSha256Sum(binaryPath);
      if (sha256sum !== binaryInfo.sha256sum) {
        throw new Error(
          `SHA256 sum of downloaded binary does not match expected value Excepted: ${binaryInfo.sha256sum} Actual: ${sha256sum}`
        );
      }
    } else {
      throw new Error(`Downloaded binary does not exist at ${binaryPath}`);
    }

    store.dispatch(cliDownloadEnd(null));
  } catch (e) {
    store.dispatch(cliDownloadEnd(e.toString()));
  }

  locked = false;

  return binaryInfo;
}
