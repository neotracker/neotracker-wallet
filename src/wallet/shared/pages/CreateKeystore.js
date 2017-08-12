/* @flow */
import Helmet from 'react-helmet';
import React from 'react';
import { Redirect } from 'react-router-dom';

import {
  compose,
  getContext,
  pure,
  withHandlers,
} from 'recompose';
import { connect } from 'react-redux';

import {
  CardView,
} from '~/src/lib/components/shared/layout';
import { CreateKeystoreView } from '~/src/wallet/shared/components/keystore';
import type { Keystore, Wallet } from '~/src/wallet/shared/wallet';
import type { WalletContext } from '~/src/wallet/shared/WalletContext';

import {
  addWallet,
  selectSelectedWallet,
} from '~/src/wallet/shared/redux';
import log from '~/src/shared/log';
import * as routes from '~/src/wallet/shared/routes';
import * as walletAPI from '~/src/wallet/shared/wallet';

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  wallet: ?Wallet,
  onCreate: (keystore: Keystore, privateKey: Buffer) => void,
  walletContext: WalletContext,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function CreateKeystore({
  wallet,
  onCreate,
  className,
  walletContext,
}: Props): React.Element<any> {
  if (wallet == null || wallet.isLocked) {
    return <Redirect to={routes.makePath(walletContext, routes.HOME)} />;
  }

  return (
    <CardView className={className} title="Create Keystore">
      <Helmet><title>{'Create Keystore'}</title></Helmet>
      <CreateKeystoreView
        privateKey={wallet.privateKey}
        onCreate={onCreate}
      />
    </CardView>
  );
}

export default (compose(
  getContext({
    walletContext: () => null,
    loggingContext: () => null,
  }),
  connect(
    (state, { walletContext }) => ({
      wallet: selectSelectedWallet(walletContext, state),
    }),
    dispatch => ({ dispatch }),
  ),
  withHandlers({
    onCreate: ({
      dispatch,
      wallet,
      history,
      walletContext,
      loggingContext,
    }) => (keystore: Keystore, privateKey: Buffer) => {
      if (wallet != null) {
        const newWallet = walletAPI.createUnlockedWallet({
          isLocked: false,
          address: wallet.address,
          privateKey,
          name: wallet.name,
          keystore,
        });
        dispatch(addWallet({ wallet: newWallet }));
        history.replace(routes.makePath(walletContext, routes.HOME));
        log({
          event: 'CREATE_KEYSTORE_FOR_EXISTING',
          context: loggingContext,
        });
      }
    },
  }),
  pure,
)(CreateKeystore): Class<React.Component<void, ExternalProps, void>>);
