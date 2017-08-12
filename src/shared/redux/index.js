/* @flow */
import { createSelector } from 'reselect';

import walletReducer from '~/src/wallet/shared/redux';

import snackbarReducer, {
  selectSnackbarProps as _selectSnackbarProps,
  type State as SnackbarState,
} from './snackbar';
import timerReducer, {
  selectTimerState as _selectTimerState,
  type State as TimerState,
} from './timer';

export type { SnackbarProps } from './snackbar';

export {
  clearSnackbar,
  setSnackbar,
} from './snackbar';
export {
  flip,
} from './timer';

type State = {
  snackbar: SnackbarState,
  timer: TimerState,
  wallet: Object,
};

const selectSnackbar = (state: State) => state.snackbar;
export const selectSnackbarProps = createSelector(
  selectSnackbar,
  _selectSnackbarProps,
);

const selectTimer = (state: State) => state.timer;
export const selectTimerState = createSelector(
  selectTimer,
  _selectTimerState,
);

export const selectWallet = (state: State) => state.wallet;

export default {
  snackbar: snackbarReducer,
  timer: timerReducer,
  wallet: walletReducer,
};
