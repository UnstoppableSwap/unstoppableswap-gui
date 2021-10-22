import path from 'path';
import { checkFileExists, getFileSha256Sum } from '../../utils/file-utils';

test('should compute correct sha256 hash of file', async () => {
  const hash = await getFileSha256Sum(
    path.join(__dirname, './example_files/hello_world.txt')
  );
  expect(hash).toBe(
    'a948904f2f0f479b8f8197694b30184b0d2ed1c1cd2a1ec0fb85d299a192a447'
  );
});

test('should correctly check if file exists', async () => {
  expect(
    await checkFileExists(
      path.join(__dirname, './example_files/hello_world.txt')
    )
  ).toBe(true);

  expect(
    await checkFileExists(
      path.join(__dirname, './example_files/doesnt_exist.txt')
    )
  ).toBe(false);
});
