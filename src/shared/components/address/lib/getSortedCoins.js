/* @flow */
import BigNumber from 'bignumber.js';

import _ from 'lodash';

import {
  ANTSHARES_ASSET_HASH,
  ANTCOINS_ASSET_HASH,
  NEO_COIN_ASSET,
  GAS_COIN_ASSET,
} from '~/src/lib/blockchain/shared/constants';

import {
  type CoinTable_coins,
} from './__generated__/CoinTable_coins.graphql';

export default (coins: CoinTable_coins) => {
  let result = _.partition(
    coins,
    coin => coin.asset.transaction_hash === ANTSHARES_ASSET_HASH,
  );
  let neoCoin = null;
  if (result[0].length > 0) {
    neoCoin = result[0][0];
  } else {
    neoCoin = {
      value: '0',
      asset: NEO_COIN_ASSET,
    };
  }

  result = _.partition(
    result[1],
    coin => coin.asset.transaction_hash === ANTCOINS_ASSET_HASH,
  );
  let gasCoin = null;
  if (result[0].length > 0) {
    gasCoin = result[0][0];
  } else {
    gasCoin = {
      value: '0',
      asset: GAS_COIN_ASSET,
    };
  }

  const sortedResult = result[1].sort((x, y) => {
    const xNumber = new BigNumber(x.value);
    const yNumber = new BigNumber(y.value);
    if (xNumber.lt(yNumber)) {
      return -1;
    } else if (xNumber.gt(yNumber)) {
      return 1;
    }

    return 0;
  });

  // TODO: Eventually sort by real world value
  return [neoCoin, gasCoin].concat(sortedResult).filter(Boolean);
}
