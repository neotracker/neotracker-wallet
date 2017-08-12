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
import type { UnlockedWallet } from '~/src/wallet/shared/wallet';

import { createSafeRetry } from '~/src/lib/utils/shared';
import { queryRenderer } from '~/src/shared/graphql/relay';

import {
  type MainWalletViewUnlockedQueryResponse
} from './__generated__/MainWalletViewUnlockedQuery.graphql';

const styleSheet = createStyleSheet('MainWalletViewUnlocked', theme => ({
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

const safeRetry = createSafeRetry();

type ExternalProps = {|
  wallet: UnlockedWallet,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  props: ?MainWalletViewUnlockedQueryResponse,
  lastProps: ?MainWalletViewUnlockedQueryResponse,
  error: ?Error,
  retry: ?() => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function MainWalletViewUnlocked({
  wallet,
  props: propsIn,
  lastProps,
  error: errorIn,
  retry,
  className,
  styleManager,
}: Props): React.Element<any> {
  const classes = styleManager.render(styleSheet);
  if (errorIn != null && retry != null) {
    safeRetry(retry);
  } else {
    safeRetry.cancel();
  }

  const props = propsIn || lastProps;
  const error = props == null ? errorIn : null;
  const address = props == null ? null : props.address;
  const loading = props == null;
  return (
    <div className={className}>
      <SelectCard
        wallet={wallet}
        address={address}
        loading={loading}
        error={error}
        retry={retry}
      />
      <TransferCard
        className={classes.marginTop}
        wallet={wallet}
        address={address}
        loading={loading}
        error={error}
        retry={retry}
      />
      <WalletTransactionsCard
        className={classes.marginTop}
        wallet={wallet}
        address={address}
        loading={loading}
        error={error}
        retry={retry}
      />
      <InfoCard
        className={classes.marginTop}
        wallet={wallet}
      />
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  queryRenderer(graphql`
    query MainWalletViewUnlockedQuery($hash: String!) {
      address(hash: $hash) {
        ...SelectCard_address
        ...TransferCard_address
        ...WalletTransactionsCard_address
      }
    }
  `, {
    mapPropsToVariables: {
      client: ({ wallet }) => ({
        hash: wallet.address,
      }),
    },
    cacheConfig: {
      poll: 10000,
    },
  }),
  pure,
)(MainWalletViewUnlocked): Class<React.Component<void, ExternalProps, void>>);
