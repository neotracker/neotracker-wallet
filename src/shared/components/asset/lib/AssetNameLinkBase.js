/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';

import { Link } from '~/src/lib/components/shared/link';

import * as routes from '~/src/shared/routes';

import {
  type AssetNameLink_asset
} from './__generated__/AssetNameLink_asset.graphql';

import getName from './getName';

type ExternalProps = {|
  asset: AssetNameLink_asset,
  type?: string,
  component?: string,
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
function AssetNameLinkBase({
  asset,
  type: typeIn,
  component,
  className,
}: Props): React.Element<*> {
  const type = typeIn || 'body1';
  return (
    <Link
      className={className}
      type={(type: any)}
      component={component}
      path={routes.makeAsset(asset.transaction_hash)}
      title={getName(asset.name, asset.transaction_hash)}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(AssetNameLinkBase): Class<React.Component<void, ExternalProps, void>>);
