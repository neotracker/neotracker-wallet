/* @flow */
import { createAction, handleActions } from 'redux-actions';

import type { ClaimAllGASProgress } from '~/src/wallet/shared/wallet';

export type State = {
  claiming: { [address: string]: boolean },
  progress: { [address: string]: ?ClaimAllGASProgress },
  error: { [address: string]: ?string },
  claimConfirmTransactionHash: { [address: string]: string },
  spendConfirmTransactionHash: { [address: string]: string },
};

export const startClaiming = createAction('claim/startClaiming');
export const endClaiming = createAction('claim/endClaiming');
export const claimProgress = createAction('claim/claimProgress');
export const claimError = createAction('claim/claimError');

export default handleActions(
  {
    [startClaiming]: (state: State, { payload: { address } }) => ({
      ...state,
      claiming: {
        ...state.claiming,
        [address]: true,
      },
    }),
    [endClaiming]: (state: State, { payload: { address } }) => ({
      ...state,
      claiming: {
        ...state.claiming,
        [address]: false,
      },
    }),
    [claimProgress]: (state: State, { payload: { address, progress } }) => {
      let spendConfirmTransactionHash =
        state.spendConfirmTransactionHash[address];
      let claimConfirmTransactionHash =
        state.claimConfirmTransactionHash[address];
      switch (progress.type) {
        case 'fetch-unspent-sending':
        case 'fetch-unspent-done':
        case 'spend-all-sending':
          spendConfirmTransactionHash = null;
          claimConfirmTransactionHash = null;
          break;
        case 'spend-all-confirming':
          spendConfirmTransactionHash = progress.hash;
          break;
        case 'spend-all-confirmed':
        case 'spend-all-skip':
        case 'fetch-unclaimed-sending':
        case 'fetch-unclaimed-done':
        case 'claim-gas-sending':
          break;
        case 'claim-gas-confirming':
          claimConfirmTransactionHash = progress.hash;
          break;
        case 'claim-gas-confirmed':
        case 'claim-gas-skip':
          break;
        default:
          // eslint-disable-next-line
          (progress.type: empty);
          break;
      }
      return {
        ...state,
        progress: {
          ...state.progress,
          [address]: progress,
        },
        error: {
          ...state.error,
          [address]: null,
        },
        spendConfirmTransactionHash: {
          ...state.spendConfirmTransactionHash,
          [address]: spendConfirmTransactionHash,
        },
        claimConfirmTransactionHash: {
          ...state.claimConfirmTransactionHash,
          [address]: claimConfirmTransactionHash,
        },
      };
    },
    [claimError]: (state: State, { payload: { address, error } }) => ({
      ...state,
      error: {
        ...state.error,
        [address]: error,
      },
    }),
  },
  {
    claiming: false,
    progress: {},
    error: {},
    spendConfirmTransactionHash: {},
    claimConfirmTransactionHash: {},
  },
);

export const selectClaiming = (state: State) => state.claiming;
export const selectClaimProgress = (state: State) => state.progress;
export const selectClaimError = (state: State) => state.error;
export const selectClaimSpendConfirmHash = (state: State) =>
  state.spendConfirmTransactionHash;
export const selectClaimClaimConfirmHash = (state: State) =>
  state.claimConfirmTransactionHash;
