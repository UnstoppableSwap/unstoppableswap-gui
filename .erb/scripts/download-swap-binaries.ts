import path, { join } from 'path';
import download from 'download';
import { chmod, emptyDir, ensureDir, stat, move } from 'fs-extra';
import { constants } from 'fs';
import { Binary } from '../../src/models/downloaderModel';

const swapBinDir = path.join(__dirname, '../../build/bin/swap');

async function makeFileExecutable(binary: Binary) {
  const fullPath = path.join(binary.dirPath, binary.fileName);
  const { mode } = await stat(fullPath);
  await chmod(
    fullPath,
    // eslint-disable-next-line no-bitwise
    mode | constants.S_IXUSR | constants.S_IXGRP | constants.S_IXOTH,
  );
}

const CLI_VERSION = '0.13.3';
// Ensure the value here matches with the one in src/main/cli/dirs.ts
const CLI_FILE_NAME_VERSION_PREFIX = '0_13_3_';

const binaries = [
  {
    dest: path.join(swapBinDir, 'linux'),
    url: `https://github.com/comit-network/xmr-btc-swap/releases/download/${CLI_VERSION}/swap_${CLI_VERSION}_Linux_x86_64.tar`,
    filename: 'swap',
  },
  {
    dest: path.join(swapBinDir, 'mac'),
    url: `https://github.com/comit-network/xmr-btc-swap/releases/download/${CLI_VERSION}/swap_${CLI_VERSION}_Darwin_x86_64.tar`,
    filename: 'swap',
  },
  {
    dest: path.join(swapBinDir, 'win'),
    url: `https://github.com/comit-network/xmr-btc-swap/releases/download/${CLI_VERSION}/swap_${CLI_VERSION}_Windows_x86_64.zip`,
    filename: 'swap.exe',
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

    // Append the prefix to the binary filename
    const newFilename = `${CLI_FILE_NAME_VERSION_PREFIX}${binary.filename}`;
    await move(
      join(binary.dest, binary.filename),
      join(binary.dest, newFilename),
    );
    binary.filename = newFilename;

    // Chmod binary in the directory to make them executable
    await makeFileExecutable({
      dirPath: binary.dest,
      fileName: binary.filename,
    });

    console.log(
      `Downloaded and extracted ${binary.url} to ${binary.dest} as ${binary.filename}`,
    );
  }),
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
