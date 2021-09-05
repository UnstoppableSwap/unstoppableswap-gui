import fs, { PathLike } from 'fs';
import crypto from 'crypto';

export async function getFileSha256Sum(path: PathLike): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(path);
    stream.on('error', (err) => reject(err));
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

export function isXmrAddressValid(address: string, stagenet: boolean) {
  const re = stagenet
    ? '[57][0-9AB][1-9A-HJ-NP-Za-km-z]{93}'
    : '[48][0-9AB][1-9A-HJ-NP-Za-km-z]{93}';
  return new RegExp(`(?:^${re}$)`).test(address);
}

export function isBtcAddressValid(address: string, testnet: boolean) {
  const re = testnet
    ? '(tb1)[a-zA-HJ-NP-Z0-9]{25,49}'
    : '(bc1)[a-zA-HJ-NP-Z0-9]{25,49}';
  return new RegExp(`(?:^${re}$)`).test(address);
}
