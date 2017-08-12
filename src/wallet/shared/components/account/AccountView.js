/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';
import { graphql } from 'react-relay';

import { ErrorView } from '~/src/shared/components/common/error';
import { PageLoading } from '~/src/shared/components/common/loading';
import type { UnlockedWallet } from '~/src/wallet/shared/wallet';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type AccountView_address
} from './__generated__/AccountView_address.graphql';
import AccountViewBase from './AccountViewBase';

type ExternalProps = {|
  wallet: UnlockedWallet,
  address?: any,
  loading?: boolean,
  error?: ?Error,
  retry?: ?() => void,
  forward?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  address: AccountView_address,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function AccountView({
  wallet,
  address,
  loading,
  error,
  retry,
  forward,
  className,
}: Props): React.Element<any> {
  if (error != null) {
    return <ErrorView error={error} retry={retry} allowRetry />;
  }

  if (loading) {
    return <PageLoading />;
  }

  return (
    <AccountViewBase
      className={className}
      wallet={wallet}
      address={address}
      onClaimConfirmed={retry}
      forward={forward}
    />
  );
}

export default (compose(
  fragmentContainer({
    address: graphql`
      fragment AccountView_address on Address {
        ...AccountViewBase_address
      }
    `,
  }),
  pure,
)(AccountView): Class<React.Component<void, ExternalProps, void>>);
