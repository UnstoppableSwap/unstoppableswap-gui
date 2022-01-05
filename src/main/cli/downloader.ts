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
          'a179ae3d5bd8a69203ac473dc3c7b64a458b14fb16a967b4f280cf9621b3626b',
        name: 'swap',
      };
    case 'linux':
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/preview/swap_preview_Linux_x86_64.tar',
        sha256sum:
          '22435abfb0d08f78459a12aacabaa4e39b5e5d1ce08a0ff3712eb2139206796c',
        name: 'swap',
      };
    default:
      return {
        url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/preview/swap_preview_Windows_x86_64.zip',
        sha256sum:
          '9030faf7925d117aa1ae7dc6bf64ec91dcd06268e4df6b5fc139bd406c30f2df',
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
