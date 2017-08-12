/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';
import { graphql } from 'react-relay';

import { SelectCard } from '~/src/wallet/shared/components/select';
import type { Wallet } from '~/src/wallet/shared/wallet';

import { queryRenderer } from '~/src/shared/graphql/relay';

type ExternalProps = {|
  wallet: Wallet,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function MainSelectCardLocked({
  wallet,
  className,
}: Props): React.Element<any> {
  return (
    <SelectCard
      className={className}
      wallet={wallet}
      address={null}
      forward
    />
  );
}

export default (compose(
  queryRenderer(graphql`
    query MainSelectCardLockedQuery($hash: String!) {
      address(hash: $hash) {
        ...SelectCard_address
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
)(MainSelectCardLocked): Class<React.Component<void, ExternalProps, void>>);
