import fs, { PathLike } from 'fs';

// eslint-disable-next-line import/prefer-default-export
export function checkFileExists(path: PathLike) {
  return fs.promises
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}
