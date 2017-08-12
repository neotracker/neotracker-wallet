/* @flow */
import BigNumber from 'bignumber.js';
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { CoinValue } from '~/src/shared/components/address/lib';

const styleSheet = createStyleSheet('TransactionValue', () => ({
  value: {
    textAlign: 'right',
  },
}));

type ExternalProps = {|
  value: string,
  negative?: boolean,
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
function TransactionValue({
  value: valueIn,
  negative,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let value = valueIn;
  if (negative) {
    value = (new BigNumber(value)).negated().toString();
  }
  return (
    <CoinValue
      className={classNames(classes.value, className)}
      value={value}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(TransactionValue): Class<React.Component<void, ExternalProps, void>>);
