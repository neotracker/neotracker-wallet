/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import { withRouter } from 'react-router-dom';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Button,
  CircularProgress,
  Typography,
} from '~/src/lib/components/shared/base';
import {
  PasswordField,
} from '~/src/wallet/shared/components/common';
import type { LockedWallet } from '~/src/wallet/shared/wallet';

import { addWallet } from '~/src/wallet/shared/redux';
import log from '~/src/shared/log';
import * as routes from '~/src/wallet/shared/routes';
import * as walletAPI from '~/src/wallet/shared/wallet';

const styleSheet = createStyleSheet('UnlockWallet', theme => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      padding: theme.spacing.unit,
    }
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      padding: theme.spacing.unit * 2,
    }
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  passwordArea: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing.unit,
    maxWidth: theme.spacing.unit * 70,
  },
  passwordField: {
    flex: '1 1 auto',
    marginRight: theme.spacing.unit,
  },
  spacer: {
    marginLeft: theme.spacing.unit,
    width: 32,
    height: 32,
  },
  progress: {
    marginLeft: theme.spacing.unit,
  },
  buttonText: {
    color: theme.custom.colors.common.white,
  },
}));

type ExternalProps = {|
  wallet: LockedWallet,
  forward?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  password: string,
  error?: string,
  loading: boolean,
  onChange: (event: Object) => void,
  onSubmit: () => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function UnlockWallet({
  className,
  password,
  error,
  loading,
  onChange,
  onSubmit,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={classNames(className, classes.root)}>
      <Typography type="body1">
        Unlock your wallet to view balance and claim GAS.
      </Typography>
      <div className={classes.passwordArea}>
        <PasswordField
          className={classes.passwordField}
          value={password}
          hasSubtext
          validation={error}
          onChange={onChange}
          onEnter={onSubmit}
          label="Enter Password"
        />
        <Button
          raised
          color="primary"
          disabled={loading}
          onClick={onSubmit}
        >
          <Typography
            className={classes.buttonText}
            type="body1"
          >
            UNLOCK
          </Typography>
        </Button>
        {
          loading
            ? <CircularProgress className={classes.progress} size={32} />
            : <div className={classes.spacer} />
        }
      </div>
    </div>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    loggingContext: () => null,
    walletContext: () => null,
  }),
  withState('state', 'setState', () => ({
    password: '',
    loading: false,
    error: null,
  })),
  withProps(({ state }) => state),
  connect(null, dispatch => ({ dispatch })),
  withRouter,
  withHandlers({
    onChange: ({ setState }) => (event) => {
      const password = event.target.value;
      setState(prevState => ({
        ...prevState,
        password,
        error: null,
      }));
    },
    onSubmit: ({
      history,
      wallet,
      password,
      setState,
      dispatch,
      forward,
      loggingContext,
      walletContext,
    }) => () => {
      setState(prevState => ({
        ...prevState,
        loading: true,
      }));
      walletAPI.unlockWallet({ wallet, password })
        .then((unlockedWallet) => {
          setState(prevState => ({
            ...prevState,
            loading: false,
          }));
          dispatch(addWallet({ wallet: unlockedWallet }));
          if (forward) {
            history.push(routes.makePath(walletContext, routes.HOME));
          }
          log({
            event: 'UNLOCK_WALLET_KEYSTORE',
            context: loggingContext,
          });
        })
        .catch(error => {
          setState(prevState => ({
            ...prevState,
            loading: false,
            error: `Unlock wallet failed: ${error.message}`,
          }));
          log({
            event: 'UNLOCK_WALLET_KEYSTORE_ERROR',
            meta: { type: 'error', error },
            context: loggingContext,
          });
        })
    },
  }),
  pure,
)(UnlockWallet): Class<React.Component<void, ExternalProps, void>>);
