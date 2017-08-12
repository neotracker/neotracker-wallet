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
  assetTransactionHash: string,
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
function AssetLink({
  assetTransactionHash,
  className,
}: Props): React.Element<*> {
  return (
    <Link
      className={className}
      type="body1"
      path={routes.makeAsset(assetTransactionHash)}
      title={assetTransactionHash}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(AssetLink): Class<React.Component<void, ExternalProps, void>>);
