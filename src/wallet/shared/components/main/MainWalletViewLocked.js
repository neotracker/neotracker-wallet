/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';
import { graphql } from 'react-relay';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { InfoCard } from '~/src/wallet/shared/components/info';
import { TransferCard } from '~/src/wallet/shared/components/account';
import { SelectCard } from '~/src/wallet/shared/components/select';
import { WalletTransactionsCard } from '~/src/wallet/shared/components/transaction';
import type { Wallet } from '~/src/wallet/shared/wallet';

import { queryRenderer } from '~/src/shared/graphql/relay';

const styleSheet = createStyleSheet('MainWalletViewLocked', theme => ({
  [theme.breakpoints.down('sm')]: {
    marginTop: {
      marginTop: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    marginTop: {
      marginTop: theme.spacing.unit * 2,
    },
  },
  marginTop: {},
}));

type ExternalProps = {|
  wallet: Wallet,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function MainWalletViewLocked({
  wallet,
  className,
  styleManager,
}: Props): React.Element<any> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={className}>
      <SelectCard wallet={wallet} address={null} />
      <TransferCard
        className={classes.marginTop}
        wallet={wallet}
        address={null}
      />
      <WalletTransactionsCard
        className={classes.marginTop}
        wallet={wallet}
        address={null}
      />
      <InfoCard className={classes.marginTop} wallet={wallet} />
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  queryRenderer(graphql`
    query MainWalletViewLockedQuery($hash: String!) {
      address(hash: $hash) {
        ...SelectCard_address
        ...TransferCard_address
        ...WalletTransactionsCard_address
      }
    }
  `, {
    skipNullVariables: true,
    mapPropsToVariables: {
      client: () => null,
      server: () => null,
    },
  }),
  pure,
)(MainWalletViewLocked): Class<React.Component<void, ExternalProps, void>>);
