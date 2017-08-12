/* @flow */
import { createAction, handleActions } from 'redux-actions';

export type State = {
  state: boolean,
};

export const flip = createAction('timer/flip');

export default handleActions(
  {
    [flip]: (state: State): State => ({
      state: !state.state,
    }),
  },
  { state: true },
);

export const selectTimerState = (state: State) => state.state;
