/* @flow */
import React from 'react';
import MUIIcon from 'material-ui/Icon/Icon';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';

const styleSheet = createStyleSheet('Icon', theme => ({
  icon: {
    color: theme.palette.text.primary,
  },
}));

type ExternalProps = {
  children?: any,
  className?: string,
};
// eslint-disable-next-line
type InternalProps = {|
  styleManager: AppStyleManager,
|};
/* ::
type Props = {
  ...ExternalProps,
  ...InternalProps,
};
*/
function Icon({
  className,
  styleManager,
  children,
  ...other
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <MUIIcon
      {...other}
      className={className == null ? classes.icon : className}
    >
      {children}
    </MUIIcon>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(Icon): Class<React.Component<void, ExternalProps, void>>);
