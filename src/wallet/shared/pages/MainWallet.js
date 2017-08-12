/* @flow */
import Helmet from 'react-helmet';
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';

import {
  CenteredView,
} from '~/src/lib/components/shared/layout';
import { MainWalletView } from '~/src/wallet/shared/components/main';

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
function MainWallet({
  className,
}: Props): React.Element<*> {
  return (
    <CenteredView className={className}>
      <Helmet><title>{'Wallet'}</title></Helmet>
      <MainWalletView />
    </CenteredView>
  );
}

export default (compose(
  pure,
)(MainWallet): Class<React.Component<void, ExternalProps, void>>);
