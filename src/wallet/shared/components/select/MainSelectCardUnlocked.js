/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';
import { graphql } from 'react-relay';

import { SelectCard } from '~/src/wallet/shared/components/select';
import type { UnlockedWallet } from '~/src/wallet/shared/wallet';

import { createSafeRetry } from '~/src/lib/utils/shared';
import { queryRenderer } from '~/src/shared/graphql/relay';

import {
  type MainSelectCardUnlockedQueryResponse
} from './__generated__/MainSelectCardUnlockedQuery.graphql';

const safeRetry = createSafeRetry();

type ExternalProps = {|
  wallet: UnlockedWallet,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  props: ?MainSelectCardUnlockedQueryResponse,
  lastProps: ?MainSelectCardUnlockedQueryResponse,
  error: ?Error,
  retry: ?() => void,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function MainSelectCardUnlocked({
  wallet,
  props: propsIn,
  lastProps,
  error: errorIn,
  retry,
  className,
}: Props): React.Element<any> {
  const props = propsIn || lastProps;
  if (errorIn != null && retry != null) {
    safeRetry(retry);
  } else {
    safeRetry.cancel();
  }
  const error = props == null ? errorIn : null;
  const address = props == null ? null : props.address;
  const loading = props == null;
  return (
    <SelectCard
      className={className}
      wallet={wallet}
      address={address}
      loading={loading}
      error={error}
      retry={retry}
      forward
    />
  );
}

export default (compose(
  queryRenderer(graphql`
    query MainSelectCardUnlockedQuery($hash: String!) {
      address(hash: $hash) {
        ...SelectCard_address
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
)(MainSelectCardUnlocked): Class<React.Component<void, ExternalProps, void>>);
