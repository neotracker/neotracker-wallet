/* @flow */
import type React from 'react';

import { createAction, handleActions } from 'redux-actions';

export type SnackbarProps = {
  message: string | React.Element<any>,
  action: React.Element<any>,
  omitClose?: boolean,
  timeoutMS?: number,
};
export type State = {
  props: ?SnackbarProps,
};

export const setSnackbar = createAction('snackbar/setSnackbar');
export const clearSnackbar = createAction('snackbar/clearSnackbar');

export default handleActions(
  {
    [setSnackbar]: (state: State, { payload }): State => ({
      props: payload,
    }),
    [clearSnackbar]: (): State => ({ props: null }),
  },
  { props: null },
);

export const selectSnackbarProps = (state: State) => state.props;
