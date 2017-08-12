/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';

import { Link } from '~/src/lib/components/shared/link';

import { BlockTime } from '~/src/shared/components/block/lib';

import * as routes from '~/src/shared/routes';

type ExternalProps = {|
  transactionHash: ?string,
  blockTime: ?number,
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
function TransactionTimeLink({
  transactionHash,
  blockTime,
  className,
}: Props): React.Element<any> {
  const title = <BlockTime blockTime={blockTime} />;
  if (transactionHash == null) {
    return title;
  }

  return (
    <Link
      className={className}
      type="body1"
      path={routes.makeTransaction(transactionHash)}
      title={title}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(TransactionTimeLink): Class<React.Component<void, ExternalProps, void>>);
