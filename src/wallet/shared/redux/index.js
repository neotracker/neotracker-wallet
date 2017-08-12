/* @flow */
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import type { WalletContext } from '~/src/wallet/shared/WalletContext';

import claimReducer, {
  selectClaiming as _selectClaiming,
  selectClaimProgress as _selectClaimProgress,
  selectClaimError as _selectClaimError,
  selectClaimSpendConfirmHash as _selectClaimSpendConfirmHash,
  selectClaimClaimConfirmHash as _selectClaimClaimConfirmHash,
  type State as ClaimState,
} from './claim';
import walletReducer, {
  selectConfirmTransaction as _selectConfirmTransaction,
  selectWallets as _selectWallets,
  selectSelectedWallet as _selectSelectedWallet,
  selectWalletReady as _selectWalletReady,
  type State as WalletState,
} from './wallet';

export {
  startClaiming,
  endClaiming,
  claimProgress,
  claimError,
} from './claim';

export {
  addWallet,
  deleteWallet,
  selectWallet,
  clearConfirmTransaction,
  confirmTransaction,
} from './wallet';

type State = {|
  claim: ClaimState,
  wallet: WalletState,
|};

const createExternalSelector =
  (selector) => (context: WalletContext, state: Object) =>
    selector(context.selectWallet(state))

const selectWallet = (state: State) => state.wallet;
export const selectWallets = createExternalSelector(createSelector(
  selectWallet,
  _selectWallets,
));
export const selectSelectedWallet = createExternalSelector(createSelector(
  selectWallet,
  _selectSelectedWallet,
));
export const selectWalletReady = createExternalSelector(createSelector(
  selectWallet,
  _selectWalletReady,
));
export const selectConfirmTransaction = createExternalSelector(createSelector(
  selectWallet,
  _selectConfirmTransaction,
));

const selectClaim = (state: State) => state.claim;
export const selectClaimProgress = createExternalSelector(createSelector(
  selectClaim,
  _selectClaimProgress,
));
export const selectClaimError = createExternalSelector(createSelector(
  selectClaim,
  _selectClaimError,
));
export const selectClaiming = createExternalSelector(createSelector(
  selectClaim,
  _selectClaiming,
));
export const selectClaimSpendConfirmHash = createExternalSelector(createSelector(
  selectClaim,
  _selectClaimSpendConfirmHash,
));
export const selectClaimClaimConfirmHash = createExternalSelector(createSelector(
  selectClaim,
  _selectClaimClaimConfirmHash,
));

export default combineReducers({
  claim: claimReducer,
  wallet: walletReducer,
});
