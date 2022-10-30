import path from 'path';
import download from 'download';
import { emptyDir, ensureDir } from 'fs-extra';

const swapBinDir = path.join(__dirname, '../../build/bin/swap');

const binaries = [
  {
    dest: path.join(swapBinDir, 'linux'),
    url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.11.1/swap_0.11.1_Linux_x86_64.tar',
  },
  {
    dest: path.join(swapBinDir, 'mac'),
    url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.11.1/swap_0.11.1_Darwin_x86_64.tar',
  },
  {
    dest: path.join(swapBinDir, 'win'),
    url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/0.11.1/swap_0.11.1_Windows_x86_64.zip',
  },
];

console.log(`Downloading ${binaries.length} swap binaries...`);
Promise.all(
  binaries.map(async (binary) => {
    console.log(`Downloading and extracting ${binary.url} to ${binary.dest}`);
    await ensureDir(binary.dest);
    await emptyDir(binary.dest);
    await download(binary.url, binary.dest, {
      extract: true,
    });
    console.log(`Downloaded and extracted ${binary.url} to ${binary.dest}`);
  })
)
  .then(() => {
    console.log(`Successfully downloaded ${binaries.length} swap binaries!`);
    process.exit(0);
    return 0;
  })
  .catch((error) => {
    console.error(`Failed to download swap binaries! Error: ${error}`);
    process.exit(1);
  });
