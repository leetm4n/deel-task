import { Logger } from 'pino';

export const noopLogger: Logger = {
  fatal: () => {
    return;
  },
  info: () => {
    return;
  },
  warn: () => {
    return;
  },
  debug: () => {
    return;
  },
  error: () => {
    return;
  },
  trace: () => {
    return;
  },
  silent: () => {
    return;
  },
  child: (): Logger => {
    return noopLogger;
  },
  level: 'info',
} as unknown as Logger;
