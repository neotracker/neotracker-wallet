/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';

import { Link } from '~/src/lib/components/shared/link';

import * as routes from '~/src/shared/routes';

type ExternalProps = {|
  contractHash: string,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {||};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function ContractLink({
  contractHash,
  className,
}: Props): React.Element<*> {
  return (
    <Link
      className={className}
      type="body1"
      path={routes.makeContract(contractHash)}
      title={contractHash}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(ContractLink): Class<React.Component<void, ExternalProps, void>>);
