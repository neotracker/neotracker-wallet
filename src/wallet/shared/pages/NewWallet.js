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
import { NewWalletFlow } from '~/src/wallet/shared/components/new';

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
function NewWallet({
  className,
}: Props): React.Element<*> {
  return (
    <CardView className={className} title="New Wallet">
      <Helmet><title>{'New Wallet'}</title></Helmet>
      <NewWalletFlow />
    </CardView>
  );
}

export default (compose(
  pure,
)(NewWallet): Class<React.Component<void, ExternalProps, void>>);
