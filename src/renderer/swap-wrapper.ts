import { app } from 'electron';
import path from 'path';
import download from 'download';
import { promises as fs } from 'fs';
import { Provider } from './store';

let dataPath: string | null = null;

async function getDataPath() {
  const dPath = path.join(app.getPath('appData'), 'unstoppableswap');
  await fs.mkdir(dPath, {
    recursive: true,
  });
  return dPath;
}

function getBinaryUrl(): string {
  switch (process.platform) {
    case 'darwin':
      return 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.8.0/swap_0.8.0_Darwin_x86_64.tar';
    case 'linux':
      return 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.8.0/swap_0.8.0_Linux_x86_64.tar';
    default:
      return 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.8.0/swap_0.8.0_Windows_x86_64.zip';
  }
}

export async function initializeBinary() {
  dataPath = await getDataPath();
  const binaryUrl = getBinaryUrl();

  await download(binaryUrl, dataPath, {
    extract: true,
  });
}

export async function startSwap(
  provider: Provider,
  payoutAddress: string,
  refundAddress: string
) {
  provider.peerId = '';
}

interface SwapState {
  name: string;
}

interface InitializingBinaryState extends SwapState {
  downloadPercentage: number;
  downloadPath: string;
}
