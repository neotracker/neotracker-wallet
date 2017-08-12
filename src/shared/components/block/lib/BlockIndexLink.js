/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';

import { Link } from '~/src/lib/components/shared/link';

import { formatNumber } from '~/src/lib/utils/shared';
import * as routes from '~/src/shared/routes';

type ExternalProps = {|
  blockIndex: number,
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
function BlockIndexLink({
  blockIndex,
  className,
}: Props): React.Element<*> {
  return (
    <Link
      className={className}
      type="body1"
      path={routes.makeBlockIndex(blockIndex)}
      title={formatNumber(blockIndex)}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(BlockIndexLink): Class<React.Component<void, ExternalProps, void>>);
