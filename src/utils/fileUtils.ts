import fs, { PathLike } from 'fs';
import crypto from 'crypto';

export function checkFileExists(path: PathLike) {
  return fs.promises
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

export async function getFileSha256Sum(path: PathLike) {
  const data = await fs.promises.readFile(path);
  return crypto.createHash('sha256').update(data).digest('hex');
}
