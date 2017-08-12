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
import type { Keystore } from '~/src/wallet/shared/wallet';

import { addWallet } from '~/src/wallet/shared/redux';
import log from '~/src/shared/log';
import * as routes from '~/src/wallet/shared/routes';
import * as walletAPI from '~/src/wallet/shared/wallet';

const styleSheet = createStyleSheet('OpenWalletKeystore', theme => ({
  [theme.breakpoints.down('sm')]: {
    passwordField: {
      paddingTop: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    passwordField: {
      paddingTop: theme.spacing.unit * 2,
    },
  },
  root: {
    flex: '1 1 auto',
    maxWidth: theme.spacing.unit * 70,
  },
  passwordArea: {
    display: 'flex',
    flexDirection: 'column',
  },
  passwordField: {
    flex: '1 1 auto',
  },
  buttonText: {
    color: theme.custom.colors.common.white,
  },
  error: {
    color: theme.palette.error[500],
  },
  unlockArea: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  unlockButton: {
    marginLeft: theme.spacing.unit,
  },
  hidden: {
    display: 'none',
  },
}));

const INVALID_KEYSTORE_FILE = 'Invalid Keystore file.';

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  keystore: ?Keystore,
  error: ?string,
  loading: boolean,
  password: string,
  validation?: string,
  setUploadFileRef: (ref: any) => void,
  onClickUploadFile: () => void,
  onUploadFile: (event: Object) => void,
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
function OpenWalletKeystore({
  className,
  keystore,
  error,
  loading,
  password,
  validation,
  setUploadFileRef,
  onClickUploadFile,
  onUploadFile,
  onChange,
  onSubmit,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let errorElement;
  if (error != null) {
    errorElement = (
      <Typography className={classes.error} type="body1">
        {error}
      </Typography>
    );
  }
  let passwordElement;
  if (keystore != null) {
    passwordElement = (
      <div className={classes.passwordArea}>
        <PasswordField
          className={classes.passwordField}
          value={password}
          validation={validation}
          onChange={onChange}
          onEnter={onSubmit}
          label="Enter password."
        />
        <div className={classes.unlockArea}>
          {loading
            ? <CircularProgress size={32} />
            : null
          }
          <Button
            className={classes.unlockButton}
            color="primary"
            disabled={validation != null || loading}
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
  return (
    <div className={classNames(className, classes.root)}>
      <input
        className={classes.hidden}
        ref={setUploadFileRef}
        type="file"
        onChange={onUploadFile}
      />
      <Button raised color="primary" onClick={onClickUploadFile}>
        <Typography
          className={classes.buttonText}
          type="body1"
        >
          SELECT WALLET FILE
        </Typography>
      </Button>
      {errorElement}
      {passwordElement}
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
    uploadFileRef: null,
    keystore: null,
    error: null,
    password: '',
    validation: undefined,
    loading: false,
  })),
  withProps(({ state }) => state),
  withRouter,
  connect(null, (dispatch) => ({ dispatch })),
  withHandlers({
    setUploadFileRef: ({ setState }) => (uploadFileRef) =>
      setState(prevState => ({
        ...prevState,
        uploadFileRef,
      })),
    onClickUploadFile: ({ uploadFileRef }) => () => {
      if (uploadFileRef != null) {
        uploadFileRef.click();
      }
    },
    onUploadFile: ({ setState, loggingContext }) => (event) => {
      const onError = (error: Error) => {
        setState(prevState => ({
          ...prevState,
          error: INVALID_KEYSTORE_FILE,
        }));
        log({
          event: 'OPEN_WALLET_KEYSTORE_UPLOAD_FILE_ERROR',
          meta: { type: 'error', error },
          context: loggingContext,
        });
      };
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.error != null) {
          onError((reader.error: any));
        } else {
          try {
            const keystore = walletAPI.extractKeystore({
              text: (reader.result: any),
            });
            setState(prevState => ({
              ...prevState,
              keystore,
            }));
          } catch (error) {
            onError(error);
          }
        }
      };
      try {
        reader.readAsText(event.target.files[0]);
      } catch (error) {
        onError(error);
      }
    },
    onChange: ({ setState }) => (event) => {
      const password = event.target.value;
      setState(prevState => ({ ...prevState, password, validation: null }));
    },
    onSubmit: ({
      setState,
      keystore,
      password,
      history,
      dispatch,
      walletContext,
      loggingContext,
    }) => () => {
      setState(prevState => ({
        ...prevState,
        loading: true,
      }));

      walletAPI.getPrivateKey({ keystore, password })
        .then(privateKey => {
          const wallet = walletAPI.createUnlockedWallet({
            isLocked: false,
            address: keystore.address,
            privateKey,
            name: keystore.address,
            keystore,
          });
          dispatch(addWallet({ wallet }));
          history.replace(routes.makePath(walletContext, routes.HOME));
          log({
            event: 'OPEN_WALLET_KEYSTORE',
            context: loggingContext,
          });
        })
        .catch((error) => {
          setState(prevState => ({
            ...prevState,
            loading: false,
            validation: `Opening Keystore failed: ${error.message}`,
          }));
          log({
            event: 'OPEN_WALLET_KEYSTORE_ERROR',
            meta: { type: 'error', error },
            context: loggingContext,
          });
        })
    },
  }),
  pure,
)(OpenWalletKeystore): Class<React.Component<void, ExternalProps, void>>);
