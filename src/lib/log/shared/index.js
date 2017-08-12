/* @flow */
export type RequestLog = {|
  headers?: {[name: string]: string},
  httpVersion: string,
  originalUrl: string,
  query: {[name: string]: string},
|};
export type ResponseLog = {|
  statusCode: number,
|};

export type LogMetaError = {|
  type: 'error',
  error: Error,
|};
export type LogMetaErrorBlob = {|
  type: 'errorBlob',
  message?: string,
  fileName?: string,
  lineNumber?: number,
  columnNumber?: number,
|};
export type LogMetaRequest = {|
  type: 'request',
  request: RequestLog,
  response: ResponseLog,
  durationMS: number,
|};
export type LogMetaRequestError = {|
  type: 'requestError',
  error: Error,
  request: RequestLog,
  response: ResponseLog,
  durationMS: number,
|};
export type LogMetaUnexpectedRequestError = {|
  type: 'unexpectedRequestError',
  error: Error,
  request: ?RequestLog,
  response: ?ResponseLog,
|};
export type LogMetaProfile = {|
  type: 'profile',
  point: string,
  durationMS: number,
  extra: ?Object,
|};
export type BaseLogMeta =
  LogMetaError |
  LogMetaErrorBlob |
  LogMetaRequest |
  LogMetaRequestError |
  LogMetaUnexpectedRequestError |
  LogMetaProfile;

export type BaseLogEvent =
  'REQUEST' |
  'REQUEST_ERROR' |
  'UNCAUGHT_BROWSER_ERROR' |
  'GRAPHQL_ERROR' |
  'GRAPHQL_REQUEST_ERROR' |
  'IMAGE_LOAD_ERROR' |
  'GRAPHQL_MUTATION_ERROR' |
  'PROFILE' |
  'GRAPHQL_FETCH_ERROR' |
  'USER_AGENT_PARSE_ERROR' |
  'HTTP2_PUSH_ERROR';
export type BaseLogEventWithoutContext =
  'UNEXPECTED_REQUEST_ERROR' |
  'UNCAUGHT_SERVER_ERROR' |
  'SERVER_START' |
  'SERVER_LISTENING' |
  'CONFIG_VALIDATION_ERROR' |
  'CONFIG_NEXT' |
  'CONFIG_NEXT_ERROR' |
  'CONFIG_GCLOUD_FETCH_ERROR' |
  'CONFIG_GCLOUD_PARSE_ERROR';

type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
export type BaseLogMessageWithContext<LogEvent, LogMeta, LoggingContext> = {|
  event: BaseLogEvent | LogEvent,
  level?: LogLevel,
  message?: string,
  meta?: BaseLogMeta | LogMeta,
  context: LoggingContext,
|};
export type BaseLogMessageWithoutContext<
  LogEventWithoutContext,
  LogMeta,
  LoggingContext
> = {|
  event: BaseLogEventWithoutContext | LogEventWithoutContext,
  level?: LogLevel,
  message?: string,
  meta?: BaseLogMeta | LogMeta,
  context?: ?LoggingContext,
|};
export type LogMessage<
  LogEvent,
  LogEventWithoutContext,
  LogMeta,
  LoggingContext
> =
  BaseLogMessageWithContext<LogEvent, LogMeta, LoggingContext> |
  BaseLogMessageWithoutContext<LogEventWithoutContext, LogMeta, LoggingContext>;

const getNow = (): () => number => {
  if (process.env.BUILD_FLAG_IS_CLIENT) {
    return performance.now.bind(performance);
  // eslint-disable-next-line no-else-return
  } else {
    return require('performance-now');
  }
};

export const now = getNow();
type Profiler = {
  stop: () => void,
};
type BasePoint =
  'graphql/execute' |
  'reactApplication' |
  'reactApplication/bootstrap' |
  'reactApplication/renderToString' |
  'reactApplication/renderToStaticMarkup' |
  'graphql/queryDeduplicator/executeQueries' |
  'graphql/resolver' |
  'knex/query';
export type Profile<Point, LoggingContext> = (
  point: BasePoint | Point,
  context: LoggingContext,
  extra?: Object,
) => Profiler;
export type Log<
  LogEvent,
  LogEventWithoutContext,
  LogMeta,
  LoggingContext
> = (
  logMessage: LogMessage<
    LogEvent,
    LogEventWithoutContext,
    LogMeta,
    LoggingContext
  >,
  // Only used on server when logs must be flushed. This will be called once
  // they're flushed
  exitCallback?: () => void,
) => void;
const NULL_PROFILER = { stop: () => {} };
export function createProfile<
  Point: string,
  LogEvent,
  LogEventWithoutContext,
  LogMeta,
  LoggingContext,
>(
  log: Log<LogEvent, LogEventWithoutContext, LogMeta, LoggingContext>,
): Profile<Point, LoggingContext> {
  return (
    point: BasePoint | Point,
    context: LoggingContext,
    extra?: Object,
  ): Profiler => {
    if (
      process.env.BUILD_FLAG_IS_DEV ||
      process.env.BUILD_FLAG_IS_TEST ||
      process.env.BUILD_FLAG_IS_STAGING
    ) {
      const start = now();
      return {
        stop: () => {
          const durationMS = now() - start;
          if (durationMS > 1) {
            log({
              event: 'PROFILE',
              level: 'info',
              message: `${point} took ${durationMS} ms`,
              meta: {
                type: 'profile',
                point,
                durationMS,
                extra,
              },
              context,
            });
          }
        },
      };
    }

    return NULL_PROFILER;
  };
}

export const getErrorEventBlob = (errorEvent: Object) => ({
  type: 'errorBlob',
  message: errorEvent.message,
  fileName: errorEvent.fileName,
  lineNumber: errorEvent.lineNumber,
  columnNumber: errorEvent.columnNumber,
});
