import path, { join } from 'path';
import { chmod, emptyDir, stat } from 'fs-extra';
import { spawn } from 'child_process';
import { Binary } from '../../src/models/downloaderModel';
import { constants } from 'fs';

const TOR_BINARIES_GIT_URL =
  'https://github.com/UnstoppableSwap/static-tor-binaries.git';
const torBuildDir = join(__dirname, '../../build/bin/tor');

async function makeFileExecutable(binary: Binary) {
  const fullPath = path.join(binary.dirPath, binary.fileName);
  const { mode } = await stat(fullPath);
  await chmod(
    fullPath,
    // eslint-disable-next-line no-bitwise
    mode | constants.S_IXUSR | constants.S_IXGRP | constants.S_IXOTH
  );
}

const extractedTorBinaryPaths = [
  [join(torBuildDir, 'linux'), 'tor'],
  [join(torBuildDir, 'mac'), 'tor'],
  [join(torBuildDir, 'win'), 'tor.exe'],
];

// Delete tor binaries, use Node fs API instead of spawn
// to avoid spawning a process that we need to kill.
emptyDir(torBuildDir, (error) => {
  if (error) {
    console.error(`Failed to delete tor binaries! Error: ${error}`);
    process.exit(1);
  }

  const ls = spawn('git', ['clone', '-v', TOR_BINARIES_GIT_URL, torBuildDir]);

  ls.stdout.on('data', (data: unknown) => {
    console.log(`Tor Downloader: ${data}`);
  });

  ls.stderr.on('data', (data: unknown) => {
    console.log(`Tor Downloader: ${data}`);
  });

  ls.on('error', (e: unknown) => {
    console.log(`Tor Downloader Error: ${e}`);
  });

  ls.on('close', async (code: number) => {
    console.log(`Tor Downloader process exited with code ${code}`);
    if (code === 0) {
      console.log('Tor binaries downloaded successfully!');
      await Promise.all(
        extractedTorBinaryPaths.map(async (binary) => {
          await makeFileExecutable({
            dirPath: binary[0],
            fileName: binary[1],
          });
        })
      );
    } else {
      console.log('Tor binaries download failed!');
      process.exit(1);
    }
  });

  ls.on('spawn', () => {
    console.log(
      `Downloading precompiled tor binaries from ${TOR_BINARIES_GIT_URL}`
    );
  });
});
