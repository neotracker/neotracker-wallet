/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';

import { Icon } from '~/src/lib/components/shared/base';

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
function RightArrow({
  className,
}: Props): React.Element<*> {
  return <Icon className={className}>keyboard_arrow_right</Icon>;
}

export default (compose(
  pure,
)(RightArrow): Class<React.Component<void, ExternalProps, void>>);
