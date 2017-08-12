/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';
import { graphql } from 'react-relay';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type Coin_coin,
} from './__generated__/Coin_coin.graphql';
import CoinBase from './CoinBase';

type ExternalProps = {|
  coin: any,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  coin: Coin_coin,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function Coin({
  coin,
  className,
}: Props): React.Element<*> {
  return <CoinBase className={className} coin={coin} />;
}

export default (compose(
  fragmentContainer({
    coin: graphql`
      fragment Coin_coin on Coin {
        value
        asset {
          transaction_hash
          name {
            lang
            name
          }
        }
      }
    `,
  }),
  pure,
)(Coin): Class<React.Component<void, ExternalProps, void>>);
