/* @flow */
import { BaseError } from '~/src/lib/errors/shared';

import { type BaseLogMeta } from './index';

const handleError = (
  error: Error,
  explodeError: (error: Error) => Object,
): Object => {
  let errorData = null;
  if (error instanceof BaseError) {
    errorData = error.data;
    if (
      errorData != null &&
      errorData.originalError != null &&
      errorData.originalError instanceof Error
    ) {
      errorData = {
        ...errorData,
        originalError: handleError(errorData.originalError, explodeError),
      };
    }
  } else if (error.source != null) {
    errorData = { source: error.source };
  }
  return {
    error: explodeError(error),
    errorData,
  };
};

// eslint-disable-next-line
export function transformMeta<LogMeta: Object>(
  logMeta?: BaseLogMeta | LogMeta,
  explodeError: (error: Error) => Object,
): ?(BaseLogMeta | LogMeta) {
  if (logMeta) {
    if (logMeta.error && logMeta.error instanceof Error) {
      if (
        process.env.BUILD_FLAG_IS_DEV ||
        process.env.BUILD_FLAG_IS_TEST === 'true' ||
        process.env.BUILD_FLAG_IS_STAGING
      ) {
        // eslint-disable-next-line no-console
        console.error(logMeta.error);
      }
      return ({
        ...logMeta,
        error: handleError(logMeta.error, explodeError),
      }: any);
    }
  }

  return logMeta;
};
