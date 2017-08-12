/* @flow */
import _ from 'lodash';
import winston from 'winston';

import type { BaseLogMeta, LogMessage } from './index';

const explodeError = (error: Error) => winston.exception.getAllInfo(error);

const isError = (event: string) =>
  event.toLowerCase().includes('error') ||
  event.toLowerCase().includes('failure');

const cleanObject = (obj: Object) => {
  const newObj = _.pickBy(
    _.mapValues(
      obj,
      val => {
        if (typeof val === 'object') {
          return cleanObject(val);
        }
        return val;
      }
    ),
    val => val != null,
  );

  return _.isEmpty(newObj) ? null : newObj;
};

export default function<
  LogEvent: string,
  LogEventWithoutContext: string,
  LogMeta,
  LoggingContext,
>(
  transformMeta: (
    logMeta?: BaseLogMeta | LogMeta,
    explodeError: (error: Error) => Object,
  ) => ?(BaseLogMeta | LogMeta),
  log: {
    log: (
      level: string,
      event: string,
      message: ?(string | Object),
      data?: Object,
    ) => void
  },
) {
  return (
    logMessage: LogMessage<
      LogEvent,
      LogEventWithoutContext,
      LogMeta,
      LoggingContext
    >,
    exitCallback?: () => void,
  ) => {
    const { event, message, context } = logMessage;
    let level = logMessage.level;
    if (level == null) {
      level = isError(event) ? 'error' : 'info';
    }
    const meta = transformMeta(logMessage.meta, explodeError);
    const data = cleanObject({ message, meta, context });

    if (exitCallback == null) {
      if (data == null) {
        log.log(level, event);
      } else {
        log.log(level, event, data);
      }
    } else {
      // eslint-disable-next-line
      if (data == null) {
        log.log(level, event, exitCallback);
      } else {
        log.log(level, event, data, exitCallback);
      }
    }
  };
}
