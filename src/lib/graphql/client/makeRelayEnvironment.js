/* @flow */
import {
  Environment,
  RecordSource,
  Store,
  Network,
} from 'relay-runtime';
import type RelayQueryResponseCache from 'relay-runtime/lib/RelayQueryResponseCache';

import { ClientError } from '~/src/lib/errors/shared';
import { type Profile } from '~/src/lib/log/shared';
import QueryDeduplicator from '~/src/lib/graphql/shared/QueryDeduplicator';

const isMutation = operation => operation.query.operation === 'mutation';

let csrfJWT = window.__TOKEN__;
function createNetwork<LoggingContext>(
  endpoint: string,
  profile: Profile<*, LoggingContext>,
  relayResponseCache: RelayQueryResponseCache,
  loggingContext: LoggingContext,
): Network {
  const queryDeduplicator = new QueryDeduplicator(
    queries => fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(queries),
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-csrf-token': csrfJWT,
      }),
      credentials: 'same-origin',
    }).then(
      async (response) => {
        csrfJWT = response.headers.get('x-csrf-token');
        if (response.ok) {
          return response.json();
        }
        const error = await ClientError.getFromResponse(response);
        throw error;
      },
      (error) => {
        throw ClientError.getFromNetworkError(error);
      },
    ),
    profile,
  );
  return Network.create(
    (operation, variables, cacheConfig) => {
      const { id, text } = operation;
      const cacheID = id || text;
      if (!isMutation(operation)) {
        const cachedPayload = cacheConfig && cacheConfig.force
          ? null
          : relayResponseCache.get(cacheID, variables);
        if (cachedPayload != null) {
          return cachedPayload;
        }
      }
      return queryDeduplicator.execute(id, variables, loggingContext).then(
        (result) => {
          if (isMutation(operation)) {
            relayResponseCache.clear();
          } else {
            relayResponseCache.set(cacheID, variables, result);
          }
          return result;
        },
      );
    },
  );
};

export default function<LoggingContext>({
  endpoint,
  profile,
  relayResponseCache,
  loggingContext,
  records,
}: {|
  endpoint: string,
  profile: Profile<*, LoggingContext>,
  relayResponseCache: RelayQueryResponseCache,
  loggingContext: LoggingContext,
  records?: Object,
|}) {
  return new Environment({
    network: createNetwork(
      endpoint,
      profile,
      relayResponseCache,
      loggingContext,
    ),
    store: new Store(new RecordSource(records)),
  });
}
