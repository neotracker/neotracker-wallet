/* @flow */
import React from 'react';
import { renderToString } from 'react-dom/server'

import type { AppContext } from '~/src/shared/AppContext';
import { ClientError } from '~/src/lib/errors/shared';
import { ThemeProvider } from '~/src/lib/components/shared/theme';
import type { WalletContext } from '~/src/wallet/shared/WalletContext';

import log from '~/src/shared/log';

import PaperWallet from './PaperWallet';

const stylesheetTag = (sheet: string) =>
  `<link rel="stylesheet" href="${sheet}" type="text/css" />`;
const createPaperWallet = ({
  privateKey,
  address,
  styleManager,
  appContext,
}: {|
  privateKey: Buffer,
  address: string,
  styleManager: string,
  appContext: AppContext,
|}) => {
  if (typeof window === 'undefined') {
    return;
  }
  const app = (
    <ThemeProvider styleManager={styleManager}>
      <PaperWallet
        appContext={appContext}
        address={address}
        privateKey={privateKey}
      />
    </ThemeProvider>
  );
  const reactAppString = renderToString(app);

  const html = `
    <html>
      <head>
        ${appContext.css.map(sheet => stylesheetTag(sheet)).join('')}
      </head>
      <body style="background-color: white;">
        <div id="app">${reactAppString}</div>
        <script
          ${appContext.nonce != null ? `nonce="${appContext.nonce}"` : ''}
          type="text/javascript"
        >
          setTimeout(function () { window.print(); }, 2000);
        </script>
      </body>
    </html>
  `;
  const win = window.open('about:blank', '_blank');
  win.document.write(html);
};

export default ({
  privateKey,
  address,
  styleManager,
  loggingContext,
  walletContext,
  appContext,
}: {|
  privateKey: Buffer,
  address: string,
  styleManager: string,
  loggingContext: any,
  walletContext: WalletContext,
  appContext: AppContext,
|}) => {
  try {
    createPaperWallet({
      privateKey,
      address,
      styleManager,
      appContext,
    });
    log({
      event: 'CREATE_PAPER_WALLET',
      context: loggingContext,
    });
  } catch (error) {
    walletContext.showSnackbarError({
      error: new ClientError(
        'Something went wrong while creating your paper wallet. Please try ' +
        'again or refresh the page.'
      ),
    });
    log({
      event: 'CREATE_PAPER_WALLET_ERROR',
      meta: { type: 'error', error },
      context: loggingContext,
    });
  }
}
