import { join } from 'path';
import {
  TorBrowserRelease,
  TorDownloader,
} from '@dreamed-atlas/tor-downloader';
import { emptyDir, ensureDir } from 'fs-extra';

const torBuildDir = join(__dirname, '../../build/bin/tor');

const TOR_VERSION = '11.0.11';

const binaries: {
  platform: NodeJS.Platform;
  arch: string;
  dest: string;
}[] = [
  {
    platform: 'linux',
    arch: 'ia32',
    dest: join(torBuildDir, 'linux'),
  },
  {
    platform: 'darwin',
    arch: 'x64',
    dest: join(torBuildDir, 'mac'),
  },
  {
    platform: 'win32',
    arch: 'ia32',
    dest: join(torBuildDir, 'win'),
  },
];

Promise.all(
  binaries.map(async (binary) => {
    console.log(
      `Downloading and extracting tor for platform ${binary.platform} to ${binary.dest}`
    );

    await ensureDir(binary.dest);
    await emptyDir(binary.dest);

    const downloader = new TorDownloader();
    const release = await TorBrowserRelease.fromValues(
      TOR_VERSION,
      binary.platform,
      binary.arch
    );

    await downloader.retrieve(binary.dest, release);

    console.log(
      `Downloaded and extracted ${release.getFilename()} for platform ${
        binary.platform
      } to ${binary.dest}`
    );
  })
)
  .then(() => {
    console.log(`Successfully downloaded ${binaries.length} tor binaries!`);
    process.exit(0);
    return 0;
  })
  .catch((error) => {
    console.error(
      `Failed to download swap binaries! Error: ${JSON.stringify(error)}`
    );
    process.exit(1);
  });
