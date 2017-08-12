/* @flow */
import { type ExecutionResult } from 'graphql';

import _ from 'lodash';
import stringify from 'fast-stable-stringify';

import { type Profile } from '~/src/lib/log/shared';

type Query = {| id: string, variables: Object |};
type QueuedQuery<LoggingContext> = {|
  cacheKey: string,
  id: string,
  variables: Object,
  loggingContext: LoggingContext,
  resolve: (result: ExecutionResult) => void,
  reject: (error: Error) => void,
|};
type ExecuteQueries =
  (queries: Array<Query>) => Promise<Array<ExecutionResult>>;

let resolvedPromise;
export default class QueryDeduplicator<LoggingContext> {
  _executeQueries: ExecuteQueries;
  _inflight: { [key: string]: Promise<ExecutionResult> };
  _queue: Array<QueuedQuery<LoggingContext>>;
  _profile: Profile<*, LoggingContext>;

  constructor(
    executeQueries: ExecuteQueries,
    profile: Profile<*, LoggingContext>,
  ) {
    this._executeQueries = executeQueries;
    this._inflight = {};
    this._queue = [];
    this._profile = profile;
  }

  execute(
    id: string,
    variables: Object,
    loggingContext: LoggingContext,
  ): Promise<ExecutionResult> {
    const cacheKey = stringify({ id, variables });
    if (this._inflight[cacheKey] == null) {
      this._inflight[cacheKey] = this._enqueueQuery(
        cacheKey,
        id,
        variables,
        loggingContext,
      );
    }

    return this._inflight[cacheKey];
  }

  _enqueueQuery(
    cacheKey: string,
    id: string,
    variables: Object,
    loggingContext: LoggingContext,
  ): Promise<ExecutionResult> {
    if (_.isEmpty(this._inflight)) {
      if (process != null) {
        if (resolvedPromise == null) {
          resolvedPromise = Promise.resolve();
        }
        resolvedPromise.then(() => process.nextTick(this._consumeQueue));
      } else {
        setTimeout(this._consumeQueue, 0);
      }
    }

    return new Promise((resolve, reject) =>
      this._queue.push({
        cacheKey,
        id,
        variables,
        loggingContext,
        resolve,
        reject,
      }),
    );
  }

  _consumeQueue = (): void => {
    const queue = this._queue;
    this._queue = [];
    this._inflight = {};
    if (queue.length > 0) {
      const loggingContext = queue[queue.length - 1].loggingContext;
      const profiler = this._profile(
        'graphql/queryDeduplicator/executeQueries',
        loggingContext,
        {
          queue: queue.map(
            obj => ({ id: obj.id, variables: obj.variables })
          )
        },
      );
      this._executeQueries(queue.map(
        obj => ({ id: obj.id, variables: obj.variables }),
      ))
        .then((results) => {
          results.forEach((result, idx) => queue[idx].resolve(result));
          profiler.stop();
        })
        .catch((error) => {
          queue.forEach(({ reject }) => reject(error));
          profiler.stop();
        });
    }
  }
}
