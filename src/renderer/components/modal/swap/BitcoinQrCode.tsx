import QRCode from 'react-qr-code';
import { Box } from '@material-ui/core';

export default function BitcoinQrCode({ address }: { address: string }) {
  return (
    <Box
      style={{
        height: '100%',
        margin: '0 auto',
      }}
    >
      <QRCode
        value={`bitcoin:${address}`}
        size={256}
        style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        /* @ts-ignore */
        viewBox="0 0 256 256"
      />
    </Box>
  );
}
