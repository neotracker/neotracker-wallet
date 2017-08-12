/* @flow */
import Helmet from 'react-helmet';
import React from 'react';

import { createStyleSheet } from 'jss-theme-reactor';
import { compose, getContext, pure } from 'recompose';

import type { AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { Card, Grid, Typography } from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('Error404', () => ({
  root: {
    padding: 16,
  },
  card: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 24,
  },
  headline: {
    paddingBottom: 8,
  },
}));

type Props = {|
  styleManager: AppStyleManager,
|};
const Error404 = ({ styleManager }: Props) => {
  const classes = styleManager.render(styleSheet);
  return (
    <div>
      <Helmet>
        <title>{'404'}</title>
      </Helmet>
      <Grid className={classes.root} container justify="center">
        <Grid item xs={12} md={8} lg={4}>
          <Card className={classes.card}>
            <Typography type="headline" className={classes.headline}>
              Sorry, that page was not found.
            </Typography>
            <Typography type="subheading">
              Try going back to where you were or heading to the home page.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default compose(
  getContext({ styleManager: () => null }),
  pure,
)(Error404);
