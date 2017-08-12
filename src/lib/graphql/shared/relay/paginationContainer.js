/* @flow */
import {
  type ConnectionConfig,
  type GraphQLTaggedNode,
  createPaginationContainer,
} from 'react-relay';
import React from 'react';

import {
  compose,
  getContext,
  withHandlers,
  withProps,
  withState,
} from 'recompose';

import { type Log } from '~/src/lib/log/shared';

import { sanitizeError } from '~/src/lib/errors/shared';

type Config = {
  pageSize: number,
};

export default function<LoggingContext>(
  log: Log<*, *, *, LoggingContext>,
) {
  return (
    fragments: { [key: string]: GraphQLTaggedNode },
    connectionConfig: ConnectionConfig,
    config?: Config,
  ) => compose(
    getContext({ loggingContext: () => null }),
    (WrappedComponent: Class<React.Component<any, any, any>>) =>
      createPaginationContainer(
        WrappedComponent,
        fragments,
        connectionConfig,
      ),
    withState('state', 'setState', () => ({
      isLoadingMore: false,
      error: null,
    })),
    withProps(({ state }) => state),
    withHandlers({
      onLoadMore: ({
        relay,
        setState,
        loggingContext,
      }) => () => {
        if (relay.hasMore() && !relay.isLoading()) {
          setState(prevState => ({
            ...prevState,
            isLoadingMore: true,
            error: null,
          }));
          relay.loadMore((config || { pageSize: 10 }).pageSize, (error) => {
            setState(prevState => ({
              ...prevState,
              isLoadingMore: false,
              error: error == null ? null : sanitizeError(error).message,
            }));
            if (error != null) {
              log({
                event: 'GRAPHQL_FETCH_ERROR',
                meta: { type: 'error', error: (error: Error) },
                context: (loggingContext: LoggingContext),
              });
            }
          });
        }
      },
    }),
  );
}
