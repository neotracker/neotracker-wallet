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
  TimeAgo,
} from '~/src/shared/components/common/timeago';

const styleSheet = createStyleSheet('BlockTime', () => ({
  root: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

type ExternalProps = {|
  blockTime: ?number,
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
function BlockTime({
  blockTime,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <TimeAgo
      className={classNames(className, classes.root)}
      type="body1"
      time={blockTime}
      nullString="Pending"
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(BlockTime): Class<React.Component<void, ExternalProps, void>>);
