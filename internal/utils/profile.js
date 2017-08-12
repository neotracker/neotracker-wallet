/* @flow */
import now from 'performance-now';

import log from './log';

export default (title: string, what: string): { stop: () => void } => {
  const start = now();
  return {
    stop: () => {
      const durationMS = now() - start;
      log({
        title,
        message: `${what} in ${durationMS} ms`,
      });
    },
  };
};
