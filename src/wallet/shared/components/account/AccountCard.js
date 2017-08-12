/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { TitleCard } from '~/src/lib/components/shared/layout';
import {
  Typography,
} from '~/src/lib/components/shared/base';
import type { Wallet } from '~/src/wallet/shared/wallet';

import { selectSelectedWallet } from '~/src/wallet/shared/redux';

import AccountView from './AccountView';

const styleSheet = createStyleSheet('AccountCard', theme => ({
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
}));

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  wallet: ?Wallet,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function AccountCard({
  wallet,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let content = (
    <Typography type="body1">
      Open or create a wallet to view balance and claim GAS.
    </Typography>
  );
  if (wallet != null) {
    if (wallet.isLocked) {
      content = (
        <Typography type="body1">
          Unlock your wallet to view balance and claim GAS.
        </Typography>
      );
    } else {
      content = <AccountView wallet={wallet} />;
    }
  }

  return (
    <TitleCard className={className} title="Balance">
      <div className={classes.content}>
        {content}
      </div>
    </TitleCard>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    walletContext: () => null,
  }),
  connect((state, { walletContext }) => ({
    wallet: selectSelectedWallet(walletContext, state),
  })),
  pure,
)(AccountCard): Class<React.Component<void, ExternalProps, void>>);
