import { promises as fs } from 'fs';
import download from 'download';
import { BinaryInfo } from 'models/downloaderModel';
import path from 'path';
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
          '7c73053f10be1a2f4da898f3f3fa7f4673e9da698081ceb7b2795b62c11b10a3',
        name: 'swap',
      };
    case 'linux':
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/preview/swap_preview_Linux_x86_64.tar',
        sha256sum:
          '47b8eb4a4efe6df0798f01bf24c7d5b7213cbcb1a55a441ef4d87b69c515cf24',
        name: 'swap',
      };
    default:
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/preview/swap_preview_Windows_x86_64.zip',
        sha256sum:
          '885a64488e65da2412169c9d9f08451493d8e61389e400d509c046dd82a8073a',
        name: 'swap.exe',
      };
  }
}

let runningOperation: Promise<BinaryInfo> | null = null;

export default async function downloadSwapBinary(): Promise<BinaryInfo> {
  if (runningOperation) {
    console.warn(
      `Download has already been initiated. Returning existing promise`
    );
    return runningOperation;
  }

  async function initiate() {
    const appDataDir = await getAppDataDir();
    const binaryInfo = getSwapBinaryInfo();
    const binaryPath = path.join(appDataDir.toString(), binaryInfo.name);

    try {
      if (await checkFileExists(binaryPath)) {
        const sha256sum = await getFileSha256Sum(binaryPath);
        if (sha256sum === binaryInfo.sha256sum) {
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
      store.dispatch(cliDownloadEnd((e as Error).toString()));
      throw e;
    }

    return binaryInfo;
  }

  runningOperation = initiate();

  return runningOperation.finally(() => {
    runningOperation = null;
  });
}
