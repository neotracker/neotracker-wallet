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
import { AddressTransactionPagingView } from '~/src/shared/components/address';
import { ErrorView } from '~/src/shared/components/common/error';
import { PageLoading } from '~/src/shared/components/common/loading';
import { TitleCard } from '~/src/lib/components/shared/layout';
import {
  Typography,
} from '~/src/lib/components/shared/base';
import type { Wallet } from '~/src/wallet/shared/wallet';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type WalletTransactionsCard_address,
} from './__generated__/WalletTransactionsCard_address.graphql';

const styleSheet = createStyleSheet('WalletTransactionsCard', theme => ({
  [theme.breakpoints.down('sm')]: {
    padding: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    padding: {
      padding: theme.spacing.unit * 2,
    },
  },
  padding: {},
}));

type ExternalProps = {|
  wallet: ?Wallet,
  address?: any,
  loading?: boolean,
  error?: ?Error,
  retry?: ?() => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  address: WalletTransactionsCard_address,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function WalletTransactionsCard({
  wallet,
  address,
  loading,
  error,
  retry,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const wrapContent = (element) => (
    <div className={classes.padding}>
      {element}
    </div>
  );
  let content = wrapContent(
    <Typography type="body1">
      Open or create a wallet to view transaction history.
    </Typography>
  );
  if (wallet != null) {
    if (wallet.isLocked) {
      content = wrapContent(
        <Typography type="body1">
          Unlock your wallet to view transaction history.
        </Typography>
      );
    } else if (error != null) {
      content = <ErrorView error={error} retry={retry} allowRetry />;
    } else if (loading) {
      content = <PageLoading />;
    } else {
      content = <AddressTransactionPagingView address={address} />;
    }
  }

  return (
    <TitleCard
      className={className}
      title="Transactions"
      titleComponent="h2"
    >
      {content}
    </TitleCard>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    address: graphql`
      fragment WalletTransactionsCard_address on Address {
        ...AddressTransactionPagingView_address
      }
    `,
  }),
  pure,
)(WalletTransactionsCard): Class<React.Component<void, ExternalProps, void>>);
