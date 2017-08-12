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
import { createStyleSheet } from 'jss-theme-reactor';

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

import log from '~/src/shared/log';
import { sanitizeError } from '~/src/lib/errors/shared';
import { validatePassword } from '~/src/wallet/shared/utils';
import * as walletAPI from '~/src/wallet/shared/wallet';

const styleSheet = createStyleSheet('CreateKeystoreView', theme => ({
  [theme.breakpoints.down('sm')]: {
    content: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    content: {
      padding: theme.spacing.unit * 2,
    },
  },
  content: {},
  passwordField: {
    flex: '1 1 auto',
    marginRight: theme.spacing.unit,
    maxWidth: theme.spacing.unit * 50,
    paddingTop: theme.spacing.unit * 2,
  },
  bold: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: `1px solid ${theme.palette.text.lightDivider}`,
  },
  createButton: {
    marginLeft: theme.spacing.unit,
  },
  error: {
    color: theme.palette.error[500],
  },
}));

const WARNING_TEXT =
  'This password encrypts your private key. This does not act as a seed to ' +
  'generate your keys.';
const BOLD_WARNING_TEXT =
  'You will need this password and your private key to unlock your wallet.';

type ExternalProps = {|
  privateKey: Buffer,
  onCreate: (keystore: Keystore, privateKey: Buffer) => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  password: string,
  loading: boolean,
  error: ?string,
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
function CreateKeystoreView({
  className,
  loading,
  password,
  error,
  onChange,
  onSubmit,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const validation = validatePassword(password);
  return (
    <div className={className}>
      <div className={classes.content}>
        <Typography type="body1">
          {WARNING_TEXT}
        </Typography>
        <Typography className={classes.bold} type="body1">
          {BOLD_WARNING_TEXT}
        </Typography>
        <PasswordField
          className={classes.passwordField}
          value={password}
          validation={validation}
          hasSubtext
          onChange={onChange}
          onEnter={onSubmit}
          label="Enter Password"
        />
      </div>
      <div className={classNames(classes.footer, classes.content)}>
        {error == null
          ? null
          : <Typography className={classes.error} type="body1">
            {error}
          </Typography>
        }
        {loading
          ? <CircularProgress size={32} />
          : null
        }
        <Button
          className={classes.createButton}
          color="primary"
          disabled={validation != null || loading}
          onClick={onSubmit}
        >
          <Typography
            color="inherit"
            type="body1"
          >
            CREATE
          </Typography>
        </Button>
      </div>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null, loggingContext: () => null }),
  withState('state', 'setState', () => ({
    password: '',
    loading: false,
    error: null,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onChange: ({ setState }) => (event) => {
      const password = event.target.value;
      setState(prevState => ({ ...prevState, password, error: null }));
    },
    onSubmit: ({
      password,
      onCreate,
      setState,
      privateKey,
      loggingContext,
    }) => () => {
      setState(prevState => ({
        ...prevState,
        loading: true,
        error: null,
      }));
      walletAPI.createKeystore({ privateKey, password })
        .then(keystore => {
          setState(prevState => ({
            ...prevState,
            loading: false,
          }));
          onCreate(keystore, privateKey);
        })
        .catch(error => {
          setState(prevState => ({
            ...prevState,
            loading: false,
            error:
              `Keystore creation failed: ${sanitizeError(error).clientMessage}`,
          }));
          log({
            event: 'CREATE_KEYSTORE_ERROR',
            meta: { type: 'error', error },
            context: loggingContext,
          });
        });
    },
  }),
  pure,
)(CreateKeystoreView): Class<React.Component<void, ExternalProps, void>>);
