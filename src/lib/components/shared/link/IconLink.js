/* @flow */
import { Link as RRLink } from 'react-router-dom';
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { Icon } from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('IconLink', theme => ({
  link: {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
}));

type ExternalProps = {|
  path: string,
  icon: string,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  styleManager: any,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function IconLink({
  path,
  icon,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <RRLink className={classes.link} to={path}>
      <Icon className={classNames(classes.link, className)}>
        {icon}
      </Icon>
    </RRLink>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(IconLink): Class<React.Component<void, ExternalProps, void>>);
