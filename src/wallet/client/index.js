/* @flow */
/* eslint-disable import/first */
import './init';

import RelayQueryResponseCache from 'relay-runtime/lib/RelayQueryResponseCache';

import injectTapEventPlugin from 'react-tap-event-plugin';
import parser from 'ua-parser-js';

import configureStore from '~/src/shared/redux/configureStore';
import log, { profile } from '~/src/shared/log';
import makeRelayEnvironment from '~/src/lib/graphql/client/makeRelayEnvironment';

import renderApp from './renderApp';
import * as routes from '~/src/shared/routes';
import * as walletRoutes from '~/src/wallet/shared/routes';
/* eslint-enable import/first */

const loggingContext = {
  type: 'client',
  originalRequestID: 'offline',
  userAgent: parser(window.navigator.userAgent),
  isTestNet: false,
};

const GRAPHQL_ENDPOINT = 'https://neotracker.io/graphql';

let handlingError = false;
const handleError = ({
  message,
  fileName,
  lineNumber,
  columnNumber,
  error,
}: {
  message?: string,
  fileName?: string,
  lineNumber?: number,
  columnNumber?: number,
  error?: Error,
}) => {
  if (!handlingError) {
    handlingError = true;
    let meta;
    if (error != null) {
      meta = { type: 'error', error };
    } else {
      meta = {
        type: 'errorBlob',
        message,
        fileName,
        lineNumber,
        columnNumber,
      };
    }
    log({
      event: 'UNCAUGHT_BROWSER_ERROR',
      level: 'error',
      meta,
      context: loggingContext,
    });
    handlingError = false;
  }
};

window.onerror = (
  message?: string,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error,
) => {
  handleError({
    message,
    lineNumber: lineno,
    columnNumber: colno,
    error,
  });
  if (process.env.BUILD_FLAG_IS_DEV) {
    return false;
  }
  return true;
};
window.addEventListener(
  'unhandledrejection',
  (event: PromiseRejectionEvent) => {
    if (event && event.reason instanceof Error) {
      handleError({ error: event.reason });
    }
    event.preventDefault();
  },
);

injectTapEventPlugin();
const relayResponseCache = new RelayQueryResponseCache({
  size: 100,
  ttl: 60 * 60 * 1000,  // 60 minutes
});
const store = configureStore();
const relayEnvironment = makeRelayEnvironment({
  endpoint: GRAPHQL_ENDPOINT,
  profile,
  relayResponseCache,
  loggingContext,
});

renderApp(
  store,
  relayEnvironment,
  loggingContext,
  {
    rootPath: '/',
    selectWallet: (state) => state.wallet,
    setSnackbar: () => {},
    showSnackbarError: () => {},
    rpcEndpoint: routes.makeURL({
      path: walletRoutes.SEND_RAW_TRANSACTION,
    }),
  },
  {
    css: ['./index.css'],
    nonce: null,
    feature: {
      wallet: {
        enabled: true,
      },
    },
    routes: {
      makePublic: (path: string) => routes.makeURL({
        path: routes.makePublic(path),
      }),
    },
  },
);
