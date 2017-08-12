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
  type TransferView_address
} from './__generated__/TransferView_address.graphql';
import SendTransaction from './SendTransaction';

type ExternalProps = {|
  wallet: UnlockedWallet,
  address: any,
  loading?: boolean,
  error?: ?Error,
  retry?: ?() => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  address: TransferView_address,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransferView({
  wallet,
  address,
  loading,
  error,
  retry,
  className,
}: Props): React.Element<any> {
  if (error != null) {
    return <ErrorView error={error} retry={retry} allowRetry />;
  }

  if (loading) {
    return <PageLoading />;
  }

  return (
    <SendTransaction
      className={className}
      wallet={wallet}
      address={address}
    />
  );
}

export default (compose(
  fragmentContainer({
    address: graphql`
      fragment TransferView_address on Address {
        ...SendTransaction_address
      }
    `,
  }),
  pure,
)(TransferView): Class<React.Component<void, ExternalProps, void>>);
