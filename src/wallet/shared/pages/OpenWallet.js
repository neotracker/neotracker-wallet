/* @flow */
import Helmet from 'react-helmet';
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';

import {
  CardView,
} from '~/src/lib/components/shared/layout';
import { OpenWalletView } from '~/src/wallet/shared/components/open';

type ExternalProps = {|
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
function OpenWallet({
  className,
}: Props): React.Element<*> {
  return (
    <CardView className={className} title="Open Wallet">
      <Helmet><title>{'Open Wallet'}</title></Helmet>
      <OpenWalletView />
    </CardView>
  );
}

export default (compose(
  pure,
)(OpenWallet): Class<React.Component<void, ExternalProps, void>>);
