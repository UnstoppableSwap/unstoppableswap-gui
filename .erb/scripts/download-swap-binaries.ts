import path from 'path';
import download from 'download';
import { emptyDirSync, ensureDirSync } from 'fs-extra';

const binDir = path.join(__dirname, '../../build/bin');
const binaries = [
  {
    dest: path.join(binDir, 'linux'),
    url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/preview/swap_preview_Linux_x86_64.tar',
  },
  {
    dest: path.join(binDir, 'mac'),
    url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/preview/swap_preview_Darwin_x86_64.tar',
  },
  {
    dest: path.join(binDir, 'win'),
    url: 'https://github.com/comit-network/xmr-btc-swap/releases/download/preview/swap_preview_Windows_x86_64.zip',
  },
];

console.log(`Downloading ${binaries.length} swap binaries...`);
Promise.all(
  binaries.map(async (binary) => {
    console.log(`Downloading and extracting ${binary.url} to ${binary.dest}`);
    ensureDirSync(binary.dest);
    emptyDirSync(binary.dest);
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
