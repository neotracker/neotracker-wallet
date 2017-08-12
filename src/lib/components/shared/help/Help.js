/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { Icon } from '~/src/lib/components/shared/base';
import { Tooltip } from '~/src/lib/components/shared/tooltip';

const styleSheet = createStyleSheet('Help', () => ({
  root: {
    cursor: 'pointer',
  },
}));

type ExternalProps = {|
  tooltip: string,
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
function Help({
  tooltip,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <Tooltip
      className={classes.root}
      title={tooltip}
      position="bottom"
    >
      <Icon className={className}>help_outline</Icon>
    </Tooltip>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(Help): Class<React.Component<void, ExternalProps, void>>);
