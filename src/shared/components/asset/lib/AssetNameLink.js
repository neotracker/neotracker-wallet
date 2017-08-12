/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { graphql } from 'react-relay';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type AssetNameLink_asset
} from './__generated__/AssetNameLink_asset.graphql';
import AssetNameLinkBase from './AssetNameLinkBase';

type ExternalProps = {|
  asset: any,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  asset: AssetNameLink_asset,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function AssetNameLink({
  asset,
  className,
}: Props): React.Element<*> {
  return <AssetNameLinkBase className={className} asset={asset} />;
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    asset: graphql`
      fragment AssetNameLink_asset on Asset {
        transaction_hash
        name {
          lang
          name
        }
      }
    `,
  }),
  pure,
)(AssetNameLink): Class<React.Component<void, ExternalProps, void>>);
