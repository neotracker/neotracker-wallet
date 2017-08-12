/* @flow */
import _ from 'lodash';

import type { BaseLogMeta, LogMessage } from './index';

export const explodeError = (error: Error) => ({
  name: error.name,
  number: error.number,
  message: error.message,
  description: error.description,
  fileName: error.fileName,
  lineNumber: error.lineNumber,
  columnNumber: error.columnNumber,
  stack: error.stack && error.stack.split('\n'),
  stackString: error.stack,
});

export type UAEvent = {|
  category: string,
  action: string,
  label?: string,
  value?: number,
|};

export const makeUAEvent = (event: string, meta?: BaseLogMeta): ?UAEvent => {
  if (meta == null) {
    return null;
  }

  switch (meta.type) {
    case 'error':
      return {
        category: event,
        action: meta.error.message,
        label: meta.error.stack || meta.error.toString(),
      };
    case 'errorBlob':
      return {
        category: event,
        action: meta.message || 'unknown',
        label:
          `${meta.fileName || ''}:${meta.lineNumber || ''}` +
          `:${meta.columnNumber || ''}`,
      };
    case 'request':
      return undefined;
    case 'requestError':
      return undefined;
    case 'unexpectedRequestError':
      return undefined;
    case 'profile':
      return {
        category: event,
        action: 'profile',
        label: meta.point,
        value: meta.durationMS,
      };
    default:
      // eslint-disable-next-line
      (meta.type: empty)
      return undefined;
  }
};

const pushDataLayer = (data: Object) => {
  const dataLayer = window.dataLayer || [];
  dataLayer.push(_.mapValues(data, () => undefined));
  dataLayer.push(data);
};

export default function<
  LogEvent,
  LogEventWithoutContext,
  LogMeta,
  LoggingContext,
  BaseDataLayer: Object,
  TLogMessage: LogMessage<
    LogEvent,
    LogEventWithoutContext,
    LogMeta,
    LoggingContext
  >
>(
  getBaseDataLayer: (context: LoggingContext) => BaseDataLayer,
  makeDataLayer: (
    base: BaseDataLayer,
    message: TLogMessage,
  ) => Object,
) {
  return (
    logMessage: TLogMessage,
  ) => {
    // const level = logMessage.level || 'info';
    const dataLayerObject: BaseDataLayer =
      logMessage.context != null && logMessage.context.type === 'client'
        ? getBaseDataLayer(logMessage.context)
        : ({}: any);

    const data = makeDataLayer(dataLayerObject, logMessage);
    if (
      process.env.BUILD_FLAG_IS_DEV ||
      process.env.BUILD_FLAG_IS_TEST === 'true'
    ) {
      // eslint-disable-next-line no-console
      console.log(data);
    }
    pushDataLayer(data);
  };
}
