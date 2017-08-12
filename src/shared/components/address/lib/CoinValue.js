/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';

import {
  Typography,
} from '~/src/lib/components/shared/base';

import { formatNumber } from '~/src/lib/utils/shared';

type ExternalProps = {|
  value: string,
  type?: string,
  component?: string,
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
function CoinValue({
  value,
  type: typeIn,
  component,
  className,
}: Props): React.Element<*> {
  const type = typeIn || 'body1';
  return (
    <Typography
      className={className}
      type={type}
      component={component}
    >
      {formatNumber(value)}
    </Typography>
  );
}

export default (compose(
  pure,
)(CoinValue): Class<React.Component<void, ExternalProps, void>>);
