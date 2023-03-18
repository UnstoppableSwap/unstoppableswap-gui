import { createHash } from 'crypto';

// eslint-disable-next-line import/prefer-default-export
export function sha256(data: string): string {
  return createHash('md5').update(data).digest('hex');
}
