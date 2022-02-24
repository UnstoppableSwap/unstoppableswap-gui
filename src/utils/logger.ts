import pino from 'pino';
import pretty from 'pino-pretty';

export default pino(
  {
    level: 'trace',
  },
  pretty({
    colorize: true,
  })
);
