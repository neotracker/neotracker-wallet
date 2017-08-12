/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { CreateKeystoreView } from '~/src/wallet/shared/components/keystore';
import type { Keystore } from '~/src/wallet/shared/wallet';
import type { WalletContext } from '~/src/wallet/shared/WalletContext';

import { addWallet } from '~/src/wallet/shared/redux';
import log from '~/src/shared/log';
import * as routes from '~/src/wallet/shared/routes';
import * as walletAPI from '~/src/wallet/shared/wallet';

import NewWalletSaveKeystore from './NewWalletSaveKeystore';
import NewWalletSavePrivateKey from './NewWalletSavePrivateKey';

type Stage =
  {|
    type: 'password',
    privateKey: Buffer,
  |} |
  {|
    type: 'save-keystore',
    keystore: Keystore,
    filename: string,
    privateKey: Buffer,
    address: string,
  |} |
  {|
    type: 'save-private-key',
    keystore: Keystore,
    privateKey: Buffer,
    address: string,
  |};

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  stage: Stage,
  onCreateKeystore: (keystore: Keystore) => void,
  onContinueKeystore: () => void,
  onContinuePrivateKey: () => void,
  walletContext: WalletContext,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function NewWalletFlow({
  className,
  onCreateKeystore,
  onContinueKeystore,
  onContinuePrivateKey,
  stage,
}: Props): ?React.Element<any> {
  switch (stage.type) {
    case 'password':
      return (
        <CreateKeystoreView
          className={className}
          privateKey={stage.privateKey}
          onCreate={onCreateKeystore}
        />
      );
    case 'save-keystore':
      return (
        <NewWalletSaveKeystore
          keystore={stage.keystore}
          filename={stage.filename}
          onContinue={onContinueKeystore}
        />
      );
    case 'save-private-key':
      return (
        <NewWalletSavePrivateKey
          privateKey={stage.privateKey}
          address={stage.address}
          onContinue={onContinuePrivateKey}
        />
      );
    default:
      // eslint-disable-next-line
      (stage: empty);
      return null;
  }
}

export default (compose(
  getContext({
    styleManager: () => null,
    loggingContext: () => null,
    walletContext: () => null,
  }),
  connect(null, dispatch => ({ dispatch })),
  withState('state', 'setState', () => ({
    stage: {
      type: 'password',
      privateKey: walletAPI.createPrivateKey(),
    },
  })),
  withProps(({ state }) => state),
  withRouter,
  withHandlers({
    onCreateKeystore: ({
      setState,
      loggingContext,
    }) => (keystore: Keystore, privateKey: Buffer) => {
      const address = walletAPI.getAddress({ privateKey });
      setState(prevState => ({
        ...prevState,
        stage: {
          type: 'save-keystore',
          keystore,
          filename: walletAPI.createKeystoreFilename({
            address,
          }),
          privateKey,
          address,
        },
      }));
      log({
        event: 'NEW_WALLET_FLOW_PASSWORD',
        context: loggingContext,
      });
      log({
        event: 'CREATE_KEYSTORE_FOR_NEW',
        context: loggingContext,
      });
    },
    onContinueKeystore: ({ setState, loggingContext }) => () => {
      setState(prevState => ({
        ...prevState,
        stage: {
          type: 'save-private-key',
          keystore: prevState.stage.keystore,
          privateKey: prevState.stage.privateKey,
          address: prevState.stage.address,
        },
      }));
      log({
        event: 'NEW_WALLET_FLOW_KEYSTORE',
        context: loggingContext,
      });
    },
    onContinuePrivateKey: ({
      dispatch,
      loggingContext,
      stage,
      history,
      walletContext,
    }) => () => {
      dispatch(addWallet({
        wallet: walletAPI.createUnlockedWallet({
          isLocked: false,
          address: stage.address,
          privateKey: stage.privateKey,
          name: stage.address,
          keystore: stage.keystore,
        }),
      }));
      log({
        event: 'NEW_WALLET_FLOW_PRIVATE_KEY',
        context: loggingContext,
      });
      history.replace(routes.makePath(walletContext, routes.HOME));
    },
  }),
  pure,
)(NewWalletFlow): Class<React.Component<void, ExternalProps, void>>);
