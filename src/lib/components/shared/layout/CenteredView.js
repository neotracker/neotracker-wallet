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
import { Grid } from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('CenteredView', theme => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      padding: theme.spacing.unit * 2,
    },
  },
  root: {
    margin: 0,
    width: '100%',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: 1200,
    width: '100%',
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

type ExternalProps = {|
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
function CenteredView({
  children,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <Grid
      className={classNames(className, classes.root)}
      container
      gutter={0}
      justify="center"
    >
      <Grid
        className={classes.gridItem}
        item
        xs={12}
        sm={12}
        md={10}
      >
        <div className={classes.col}>
          {children}
        </div>
      </Grid>
    </Grid>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(CenteredView): Class<React.Component<void, ExternalProps, void>>);
