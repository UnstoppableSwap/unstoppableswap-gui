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
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.10.2/swap_0.10.2_Darwin_x86_64.tar',
        sha256sum:
          '3d3d701fd17a6c335bd80938204528c0c5a930041751fb66ff47a71893f1e5f1',
        name: 'swap',
      };
    case 'linux':
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.10.2/swap_0.10.2_Linux_x86_64.tar',
        sha256sum:
          '3d3d701fd17a6c335bd80938204528c0c5a930041751fb66ff47a71893f1e5f1',
        name: 'swap',
      };
    default:
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.10.2/swap_0.10.2_Windows_x86_64.zip',
        sha256sum:
          '0e5d81416626cdedc0965e65bf4a3d43119ebeab5ee19776fdcf1ab03aa9efc3',
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
