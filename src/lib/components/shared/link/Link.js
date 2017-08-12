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

import { Typography } from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('Link', theme => ({
  commonLink: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  link: {
    color: theme.palette.primary[500],
    fontWeight: theme.typography.fontWeightRegular,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary[700],
      textDecoration: 'underline',
    },
  },
  linkWhite: {
    color: theme.custom.colors.common.white,
    fontWeight: theme.typography.fontWeightRegular,
    textDecoration: 'underline',
    '&:hover': {
      color: theme.custom.colors.common.darkWhite,
      textDecoration: 'underline',
    },
  },
}));

export type Type =
  'display4' |
  'display3' |
  'display2' |
  'display1' |
  'headline' |
  'title' |
  'subheading' |
  'body2' |
  'body1' |
  'caption' |
  'button';
type ExternalProps = {|
  path: string,
  title: string | React.Element<any>,
  type?: Type,
  component?: string,
  white?: boolean,
  absolute?: boolean,
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
function Link({
  path,
  title,
  type: typeIn,
  component,
  white,
  absolute,
  className,
  styleManager,
}: Props): React.Element<any> {
  const classes = styleManager.render(styleSheet);
  const type = typeIn || 'body1';
  const classNameLink = classNames({
    [classes.link]: !white,
    [classes.linkWhite]: !!white,
  }, classes.commonLink);
  let linkText;
  if (typeof title === 'string') {
    linkText = (
      <Typography
        type={type}
        component={component}
        className={classNames(classNameLink, className)}
      >
        {title}
      </Typography>
    );
  } else {
    linkText = React.cloneElement(
      title,
      {
        ...title.props,
        className: classNames(classNameLink, className, title.props.className),
      },
      title.props.children,
    );
  }

  if (absolute || path.startsWith('http')) {
    return <a className={classNameLink} href={path}>{linkText}</a>;
  }

  return <RRLink className={classNameLink} to={path}>{linkText}</RRLink>;
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(Link): Class<React.Component<void, ExternalProps, void>>);
