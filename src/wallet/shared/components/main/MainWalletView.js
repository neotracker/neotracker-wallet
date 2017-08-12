/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';

import type { AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { PageLoading } from '~/src/shared/components/common/loading';
import type { Wallet } from '~/src/wallet/shared/wallet';

import {
  selectSelectedWallet,
  selectWalletReady,
} from '~/src/wallet/shared/redux';

import MainWalletViewLocked from './MainWalletViewLocked';
import MainWalletViewUnlocked from './MainWalletViewUnlocked';

const styleSheet = createStyleSheet('MainWalletView', theme => ({
  padding: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
}));

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  ready: boolean,
  selectedWallet: Wallet,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function MainWalletView({
  className,
  ready,
  selectedWallet,
  styleManager,
}: Props): React.Element<any> {
  const classes = styleManager.render(styleSheet);
  if (!ready) {
    return <PageLoading className={classes.padding} disablePadding />;
  }

  if (selectedWallet == null || selectedWallet.isLocked) {
    return (
      <MainWalletViewLocked
        className={className}
        wallet={selectedWallet}
      />
    );
  }

  return (
    <MainWalletViewUnlocked
      className={className}
      wallet={selectedWallet}
    />
  );
}

export default (compose(
  getContext({ walletContext: () => null, styleManager: () => null }),
  connect((state, { walletContext }) => ({
    ready: selectWalletReady(walletContext, state),
    selectedWallet: selectSelectedWallet(walletContext, state),
  })),
  pure,
)(MainWalletView): Class<React.Component<void, ExternalProps, void>>);
