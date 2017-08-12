/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { graphql } from 'react-relay';

import { Link } from '~/src/lib/components/shared/link';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';
import * as routes from '~/src/shared/routes';

import {
  type ContractNameLink_contract
} from './__generated__/ContractNameLink_contract.graphql';

type ExternalProps = {|
  contract: any,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  contract: ContractNameLink_contract,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function ContractNameLink({
  contract,
  className,
}: Props): React.Element<*> {
  return (
    <Link
      className={className}
      type="body1"
      path={routes.makeContract(contract.hash)}
      title={contract.name}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    contract: graphql`
      fragment ContractNameLink_contract on Contract {
        hash
        name
      }
    `,
  }),
  pure,
)(ContractNameLink): Class<React.Component<void, ExternalProps, void>>);
