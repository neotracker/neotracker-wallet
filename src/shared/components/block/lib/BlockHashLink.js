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
  blockHash: string,
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
function BlockHashLink({
  blockHash,
  className,
}: Props): React.Element<*> {
  return (
    <Link
      className={className}
      type="body1"
      path={routes.makeBlockHash(blockHash)}
      title={blockHash}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(BlockHashLink): Class<React.Component<void, ExternalProps, void>>);
