/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  AssetNameLinkBase
} from '~/src/shared/components/asset/lib';
import {
  type Coin_coin,
} from './__generated__/Coin_coin.graphql';

import CoinValue from './CoinValue';

const styleSheet = createStyleSheet('CoinBase', theme => ({
  coinValue: {
    display: 'flex',
  },
  value: {
    marginRight: theme.spacing.unit / 2,
  },
}));

type ExternalProps = {|
  coin: Coin_coin,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function CoinBase({
  coin,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={classNames(classes.coinValue, className)}>
      <CoinValue className={classes.value} value={coin.value} />
      <AssetNameLinkBase asset={coin.asset} />
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(CoinBase): Class<React.Component<void, ExternalProps, void>>);
