/* @flow */
import { createAction, handleActions } from 'redux-actions';
import localForage from 'localforage';
import { persistReducer } from 'redux-persist';

import type {
  LockedWallet,
  UnlockedWallet,
  Wallet,
} from '~/src/wallet/shared/wallet';

import * as walletAPI from '~/src/wallet/shared/wallet';

export type State = {
  wallets: Array<Wallet>,
  selectedWallet: ?Wallet,
  ready: boolean,
  confirmTransaction: ?{
    wallet: UnlockedWallet,
    address: string,
    amount: string,
    asset: {
      transaction_hash: string,
      name: $ReadOnlyArray<{
        name: string,
        lang: string,
      }>,
    },
  },
};

export const addWallet = createAction('wallet/addWallet');
export const deleteWallet = createAction('wallet/deleteWallet');
export const selectWallet = createAction('wallet/selectWallet');
export const confirmTransaction = createAction('wallet/confirmTransaction');
export const clearConfirmTransaction =
  createAction('wallet/clearConfirmTransaction');

const filterWallets = (wallets: Array<Wallet>, address: string) =>
  wallets.filter(wallet => wallet.address !== address);

const addWalletToWallets = (
  wallets: Array<Wallet>,
  wallet: Wallet,
): Array<Wallet> => {
  const newWallets = [];
  let found = false;
  for (const oldWallet of wallets) {
    if (oldWallet.address === wallet.address) {
      newWallets.push(wallet);
      found = true;
    } else {
      newWallets.push(oldWallet);
    }
  }

  if (!found) {
    newWallets.push(wallet);
  }

  return newWallets;
};

const convertToLockedWallets = (
  wallets: Array<Wallet>,
): Array<LockedWallet> => wallets.map(
  wallet => walletAPI.createLockedWallet(wallet),
).filter(Boolean);

let reducer = handleActions(
  {
    [addWallet]: (
      state: State,
      { payload: { wallet } },
    ): State => ({
      ...state,
      wallets: addWalletToWallets(state.wallets, wallet),
      selectedWallet: wallet,
    }),
    [deleteWallet]: (
      state: State,
      { payload: { wallet } },
    ): State => ({
      ...state,
      wallets: filterWallets(state.wallets, wallet.address),
      selectedWallet: (
        state.selectedWallet != null &&
        state.selectedWallet.address === wallet.address
      )
        ? null
        : state.selectedWallet,
    }),
    [selectWallet]: (
      state: State,
      { payload: { wallet } },
    ): State => ({
      ...state,
      selectedWallet: wallet,
    }),
    [confirmTransaction]: (
      state: State,
      { payload },
    ): State => ({
      ...state,
      confirmTransaction: payload,
    }),
    [clearConfirmTransaction]: (
      state: State,
    ): State => ({
      ...state,
      confirmTransaction: null,
    }),
    'persist/REHYDRATE': (
      state: State,
    ): State => ({
      ...state,
      ready: true,
    }),
  },
  {
    wallets: [],
    selectedWallet: null,
    ready: false,
    confirmTransaction: null,
  },
);

if (process.env.BUILD_FLAG_IS_CLIENT) {
  reducer = persistReducer(
    {
      key: 'wallet',
      storage: localForage,
      whitelist: ['wallets', 'selectedWallet'],
      transforms: [
        {
          in: (subState, key) => {
            switch (key) {
              case 'wallets':
                return convertToLockedWallets(subState);
              case 'selectedWallet':
                return subState == null
                  ? null
                  : walletAPI.createLockedWallet(subState);
              default:
                return subState;
            }
          },
          out: (subState) => subState,
        },
      ],
    },
    reducer,
  );
}

const finalReducer = reducer;
export default finalReducer;

export const selectWallets = (state: State) => state.wallets;
export const selectSelectedWallet = (state: State) => state.selectedWallet;
export const selectWalletReady = (state: State) => state.ready;
export const selectConfirmTransaction =
  (state: State) => state.confirmTransaction;
