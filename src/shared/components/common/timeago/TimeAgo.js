/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';
import { connect } from 'react-redux';

import {
  Typography,
} from '~/src/lib/components/shared/base';

import { formatTime } from '~/src/lib/utils/shared';
import { selectTimerState } from '~/src/shared/redux';

type ExternalProps = {
  time: ?number,
  nullString?: string,
  prefix?: string,
};
// eslint-disable-next-line
type InternalProps = {|
|};
/* ::
type Props = {
  ...ExternalProps,
  ...InternalProps,
};
*/
function TimeAgo({
  time,
  nullString,
  state,
  dispatch,
  prefix,
  ...otherProps,
}: Props): React.Element<*> {
  let value;
  if (time == null) {
    value = nullString;
  } else {
    value = formatTime(time);
  }

  if (prefix != null) {
    value = `${prefix}${value || ''}`;
  }

  return (
    <Typography {...otherProps}>
      {value}
    </Typography>
  );
}

export default (compose(
  connect(
    state => ({ state: selectTimerState(state) }),
  ),
  pure,
)(TimeAgo): Class<React.Component<void, ExternalProps, void>>);
