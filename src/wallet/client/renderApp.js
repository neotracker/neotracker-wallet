/* @flow */
// eslint-disable-next-line
import { AppContainer } from 'react-hot-loader';
import { HashRouter } from 'react-router-dom';
import { type Environment } from 'relay-runtime';
import { Provider } from 'react-redux';
import React from 'react';

import { render } from 'react-dom';
import { withContext } from 'recompose';

import type { AppContext } from '~/src/shared/AppContext';
import WalletApp from '~/src/wallet/shared/WalletApp';
import type { WalletContext } from '~/src/wallet/shared/WalletContext';
import { ThemeProvider } from '~/src/lib/components/shared/theme';

import createStyleManager from '~/src/shared/styles/createStyleManager';
import { type ClientLoggingContext } from '~/src/shared/log';

const ContextProvider = withContext(
  {
    loggingContext: () => null,
    relayEnvironment: () => null,
    appContext: () => null,
    walletContext: () => null,
  },
  ({ loggingContext, relayEnvironment, appContext, walletContext }) => ({
    loggingContext,
    relayEnvironment,
    appContext,
    walletContext,
  }),
)(({ children }) => children);

const basename = window.location.pathname;
let container;
export default function renderApp(
  store: any,
  relayEnvironment: Environment,
  loggingContext: ClientLoggingContext,
  walletContext: WalletContext,
  appContext: AppContext,
  TheApp?: Class<WalletApp>,
): void {
  const AppComponent = TheApp || WalletApp;
  const app = (
    <ThemeProvider styleManager={createStyleManager()}>
      <Provider store={store}>
        <HashRouter basename={basename}>
          <ContextProvider
            relayEnvironment={relayEnvironment}
            loggingContext={loggingContext}
            appContext={appContext}
            walletContext={walletContext}
          >
            <AppComponent />
          </ContextProvider>
        </HashRouter>
      </Provider>
    </ThemeProvider>
  );
  if (container == null) {
    container = document.querySelector('#app');
  }

  render(app, container);
}
