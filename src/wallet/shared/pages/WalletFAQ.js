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
import { WalletFAQView } from '~/src/wallet/shared/components/faq';

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
function WalletFAQ({
  className,
}: Props): React.Element<*> {
  return (
    <CardView className={className} title="Wallet FAQ">
      <Helmet><title>{'Wallet FAQ'}</title></Helmet>
      <WalletFAQView />
    </CardView>
  );
}

export default (compose(
  pure,
)(WalletFAQ): Class<React.Component<void, ExternalProps, void>>);
