import { join } from 'path';
import { emptyDir } from 'fs-extra';
import { spawn } from 'child_process';

const TOR_BINARIES_GIT_URL =
  'https://github.com/UnstoppableSwap/static-tor-binaries.git';
const torBuildDir = join(__dirname, '../../build/bin/tor');

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

  ls.on('close', (code: number) => {
    console.log(`Tor Downloader process exited with code ${code}`);
    if (code === 0) {
      console.log('Tor binaries downloaded successfully!');
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
