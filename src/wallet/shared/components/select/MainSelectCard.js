/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { connect } from 'react-redux';

import type { Wallet } from '~/src/wallet/shared/wallet';

import {
  selectSelectedWallet,
  selectWalletReady,
} from '~/src/wallet/shared/redux';

import MainSelectCardLocked from './MainSelectCardLocked';
import MainSelectCardUnlocked from './MainSelectCardUnlocked';

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  ready: boolean,
  selectedWallet: Wallet,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function MainSelectCard({
  className,
  selectedWallet,
}: Props): React.Element<any> {
  if (selectedWallet == null || selectedWallet.isLocked) {
    return (
      <MainSelectCardLocked
        className={className}
        wallet={selectedWallet}
      />
    );
  }

  return (
    <MainSelectCardUnlocked
      className={className}
      wallet={selectedWallet}
    />
  );
}

export default (compose(
  getContext({ walletContext: () => null }),
  connect((state, { walletContext }) => ({
    ready: selectWalletReady(walletContext, state),
    selectedWallet: selectSelectedWallet(walletContext, state),
  })),
  pure,
)(MainSelectCard): Class<React.Component<void, ExternalProps, void>>);
