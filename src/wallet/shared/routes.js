/* @flow */
import type { WalletContext } from './WalletContext';

export const HOME = '/';
export const PUBLIC = '/public';
export const SEND_RAW_TRANSACTION = '/api/v1/sendrawtransaction';

export const NEW_WALLET = '/new-wallet';
export const isNewWallet = (path: string) =>
  path.endsWith('/new-wallet') ||
  path.endsWith('/new-wallet/');

export const OPEN_WALLET = '/open-wallet';
export const isOpenWallet = (path: string) =>
  path.endsWith('/open-wallet') ||
  path.endsWith('/open-wallet/');

export const CREATE_KEYSTORE = '/create-keystore';

export const WALLET_FAQ = '/faq';

export const makePublic = (path: string) => `${PUBLIC}${path}`;

export const makePath = (context: WalletContext, path: string) => {
  if (context.rootPath.endsWith('/')) {
    return `${context.rootPath}${path.substring(1)}`;
  }

  return `${context.rootPath}${path}`;
}
