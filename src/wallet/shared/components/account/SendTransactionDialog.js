/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  lifecycle,
  pure,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  CoinValue,
} from '~/src/shared/components/address/lib';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '~/src/lib/components/shared/base';
import type { UnlockedWallet } from '~/src/wallet/shared/wallet';

import {
  clearConfirmTransaction,
  selectConfirmTransaction,
} from '~/src/wallet/shared/redux';
import { doSendAsset } from '~/src/wallet/shared/wallet';
import {
  getName,
} from '~/src/shared/components/asset/lib';
import log from '~/src/shared/log';

const styleSheet = createStyleSheet('SendTransactionDialog', (theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  inline: {
    display: 'inline-block',
  },
  confirmText: {
    paddingTop: theme.spacing.unit,
  },
}));

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
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
  open: boolean,
  onCancel: () => void,
  onConfirm: () => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function SendTransactionDialog({
  className,
  confirmTransaction,
  open,
  onCancel,
  onConfirm,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let content;
  if (confirmTransaction != null) {
    content = (
      <div className={classes.content}>
        <Typography>
          {'You are about to send '}
          <CoinValue
            className={classes.inline}
            type="body2"
            component="span"
            value={confirmTransaction.amount}
          />
          {' '}
          <Typography className={classes.inline} type="body2" component="span">
            {getName(
              confirmTransaction.asset.name,
              confirmTransaction.asset.transaction_hash,
            )}
          </Typography>
          {' to address '}
          <Typography className={classes.inline} type="body2" component="span">
            {confirmTransaction.address}
          </Typography>
        </Typography>
        <Typography
          className={classes.confirmText}
          type="title"
          component="span"
        >
          Are you sure you want to do this?
        </Typography>
      </div>
    );
  }
  return (
    <Dialog
      className={className}
      ignoreBackdropClick
      ignoreEscapeKeyUp
      maxWidth="xs"
      open={confirmTransaction != null && open}
      onRequestClose={onCancel}
    >
      <DialogTitle>Confirm Transfer</DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          <Typography color="inherit" type="body1">
            CANCEL
          </Typography>
        </Button>
        <Button onClick={onConfirm} color="primary">
          <Typography color="inherit" type="body1">
            CONFIRM
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    relayEnvironment: () => null,
    walletContext: () => null,
    loggingContext: () => null,
  }),
  connect(
    (state, { walletContext }) => ({
      confirmTransaction: selectConfirmTransaction(walletContext, state),
    }),
    (dispatch) => ({ dispatch }),
  ),
  withState('state', 'setState', () => ({
    open: false,
    timer: null,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onCancel: ({ dispatch, loggingContext, setState }) => () => {
      setState(prevState => ({
        ...prevState,
        open: false,
        timer: setTimeout(
          () => dispatch(clearConfirmTransaction()),
          1000,
        ),
      }))
      log({
        event: 'SEND_TRANSACTION_CANCEL',
        context: loggingContext,
      });
    },
    onConfirm: ({
      confirmTransaction,
      dispatch,
      relayEnvironment,
      loggingContext,
      walletContext,
    }) => () => {
      log({
        event: 'SEND_TRANSACTION_CONFIRM',
        context: loggingContext,
      });
      doSendAsset({
        walletContext,
        environment: relayEnvironment,
        privateKey: confirmTransaction.wallet.privateKey,
        toAddress: confirmTransaction.address,
        amount: confirmTransaction.amount,
        assetHash: confirmTransaction.asset.transaction_hash,
      }).then((hash) => {
        walletContext.setSnackbar({
          message: `Sent transaction: ${hash}`,
          timeoutMS: 5000,
        });
        log({
          event: 'SEND_TRANSACTION_COMPLETE',
          context: loggingContext,
        });
      }).catch((error) => {
        walletContext.setSnackbar({
          message:
            'Something went wrong. Please try again or refresh the page.',
        });
        log({
          event: 'SEND_TRANSACTION_ERROR',
          meta: { type: 'error', error },
          context: loggingContext,
        });
      });
      dispatch(clearConfirmTransaction());
    },
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (
        this.props.confirmTransaction !== nextProps.confirmTransaction &&
        nextProps.confirmTransaction != null
      ) {
        if (nextProps.timer != null) {
          clearTimeout(nextProps.timer);
        }
        nextProps.setState(prevState => ({
          ...prevState,
          open: true,
        }));
      }
    }
  }),
  pure,
)(SendTransactionDialog): Class<React.Component<void, ExternalProps, void>>);
