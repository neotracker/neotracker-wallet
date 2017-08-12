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
  Typography,
} from '~/src/lib/components/shared/base';
import {
  PasswordField,
} from '~/src/wallet/shared/components/common';

import { addWallet } from '~/src/wallet/shared/redux';
import log from '~/src/shared/log';
import * as routes from '~/src/wallet/shared/routes';
import * as walletAPI from '~/src/wallet/shared/wallet';

const styleSheet = createStyleSheet('OpenWalletPrivateKey', theme => ({
  root: {
    flex: '1 1 auto',
    maxWidth: theme.spacing.unit * 70,
  },
  submitArea: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  privateKey: string,
  error?: string,
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
function OpenWalletPrivateKey({
  className,
  privateKey,
  error,
  onChange,
  onSubmit,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={classNames(classes.root, className)}>
      <PasswordField
        value={privateKey}
        validation={error}
        hasSubtext
        onChange={onChange}
        onEnter={onSubmit}
        label="Paste or type private key."
      />
      <div className={classes.submitArea}>
        <Button
          color="primary"
          disabled={error != null}
          onClick={onSubmit}
        >
          <Typography
            color="inherit"
            type="body1"
          >
            UNLOCK
          </Typography>
        </Button>
      </div>
    </div>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    walletContext: () => null,
    loggingContext: () => null,
  }),
  withState('state', 'setState', () => ({
    privateKey: '',
    error: undefined,
  })),
  withProps(({ state }) => state),
  withRouter,
  connect(null, (dispatch) => ({ dispatch })),
  withHandlers({
    onChange: ({ setState }) => (event) => {
      const privateKey = event.target.value;
      setState(prevState => ({
        ...prevState,
        privateKey,
        error: undefined,
      }));
    },
    onSubmit: ({
      setState,
      privateKey: privateKeyIn,
      history,
      dispatch,
      walletContext,
      loggingContext,
    }) => () => {
      const errorMessage =
        'Invalid Private Key. Please enter a valid Private Key in WIF ' +
        'format.';
      const onError = (error: Error) => {
        setState(prevState => ({
          ...prevState,
          error: errorMessage,
        }));
        log({
          event: 'OPEN_WALLET_PRIVATE_KEY_ERROR',
          meta: { type: 'error', error },
          context: loggingContext,
        });
      }

      let privateKey;
      try {
        privateKey = walletAPI.wifToPrivateKey(privateKeyIn);
      } catch (error) {
        onError(error);
        return;
      }

      const validation = walletAPI.validatePrivateKey(privateKey);
      if (validation != null) {
        onError(new Error(validation));
        return;
      }

      const address = walletAPI.getAddress({ privateKey });
      const wallet = walletAPI.createUnlockedWallet({
        isLocked: false,
        address,
        privateKey,
        name: address,
      });
      dispatch(addWallet({ wallet }));
      history.replace(routes.makePath(walletContext, routes.HOME));
      log({
        event: 'OPEN_WALLET_PRIVATE_KEY',
        context: loggingContext,
      });
    },
  }),
  pure,
)(OpenWalletPrivateKey): Class<React.Component<void, ExternalProps, void>>);
