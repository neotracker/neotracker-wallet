/* @flow */
/* eslint-disable react/no-array-index-key */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';
import { graphql } from 'react-relay';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  AssetNameLinkBase,
} from '~/src/shared/components/asset/lib';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type CoinTable_coins,
} from './__generated__/CoinTable_coins.graphql';

import CoinValue from './CoinValue';

import getSortedCoins from './getSortedCoins';

const styleSheet = createStyleSheet('CoinTable', theme => ({
  root: {
    display: 'flex',
  },
  firstCol: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing.unit,
  },
  secondCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  value: {
    textAlign: 'right',
  },
}));

export const COIN_TABLE_ROW_HEIGHT = 20;

type ExternalProps = {|
  coins: any,
  type?: string,
  component?: string,
  textClassName?: string,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  coins: CoinTable_coins,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function CoinTable({
  coins,
  type,
  component,
  textClassName,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);

  const sortedCoins = getSortedCoins(coins);

  const values = [];
  const assets = [];
  sortedCoins.forEach((coin, idx) => {
    values.push(
      <CoinValue
        key={idx}
        className={classNames(classes.value, textClassName)}
        type={type}
        component={component}
        value={coin.value}
      />
    );
    assets.push(
      <AssetNameLinkBase
        key={idx}
        type={type}
        component={component}
        asset={coin.asset}
      />
    );
  });

  return (
    <div className={classNames(className, classes.root)}>
      <div className={classes.firstCol}>
        {values}
      </div>
      <div className={classes.secondCol}>
        {assets}
      </div>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    coins: graphql`
      fragment CoinTable_coins on Coin @relay(plural: true) {
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
)(CoinTable): Class<React.Component<void, ExternalProps, void>>);
