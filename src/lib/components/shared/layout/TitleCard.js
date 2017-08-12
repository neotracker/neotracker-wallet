/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Card,
  Typography,
} from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('TitleCard', theme => ({
  [theme.breakpoints.down('sm')]: {
    header: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    header: {
      padding: theme.spacing.unit * 2,
    },
  },
  header: {
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.lightDivider}`,
    display: 'flex',
  },
}));

type ExternalProps = {|
  title: string,
  extra?: React.Element<any>,
  titleComponent?: string,
  titleType?: string,
  children?: any,
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
function TitleCard({
  title,
  children,
  titleComponent: titleComponentIn,
  titleType: titleTypeIn,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const titleComponent = titleComponentIn || 'h1';
  const titleType = titleTypeIn || 'title';
  return (
    <Card className={className}>
      <div className={classes.header}>
        <Typography
          component={titleComponent}
          type={titleType}
        >
          {title}
        </Typography>
      </div>
      {children}
    </Card>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(TitleCard): Class<React.Component<void, ExternalProps, void>>);
