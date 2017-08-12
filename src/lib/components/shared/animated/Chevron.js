/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  hoistStatics,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { Icon } from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('Chevron', theme => ({
  chevron: {
    cursor: 'pointer',
    transition: theme.transitions.create(['transform']),
  },
  chevronUp: {
    transform: 'rotate(0deg)',
  },
  chevronDown: {
    transform: 'rotate(180deg)',
  },
}));

type ExternalProps = {
  up: boolean,
  className?: string,
};
// eslint-disable-next-line
type InternalProps = {|
  styleManager: any,
|};
/* ::
type Props = {
  ...ExternalProps,
  ...InternalProps,
};
*/
function Chevron({
  up,
  className,
  styleManager,
  ...otherProps
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <Icon
      {...otherProps}
      className={classNames({
        [classes.chevron]: true,
        [classes.chevronUp]: up,
        [classes.chevronDown]: !up,
      }, className)}
    >
      keyboard_arrow_up
    </Icon>
  );
}

export default (hoistStatics(compose(
  getContext({ styleManager: () => null }),
  pure,
))(Chevron): Class<React.Component<void, ExternalProps, void>>);
