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
  Card,
  Grid,
} from '~/src/lib/components/shared/base';

import ErrorView from './ErrorView';

const styleSheet = createStyleSheet('PageError', theme => ({
  [theme.breakpoints.down('md')]: {
    root: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('md')]: {
    root: {
      padding: theme.spacing.unit * 2,
    },
  },
  root: {
    margin: 0,
    width: '100%',
  },
  cardContainer: {
    maxWidth: 456,
  },
}));

type ExternalProps = {|
  error: Error,
  retry: ?() => void,
  allowRetry?: boolean,
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
function PageError({
  error,
  retry,
  allowRetry,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <Grid
      className={classNames(classes.root, className)}
      container
      justify="center"
      gutter={16}
    >
      <Grid className={classes.cardContainer} item xs={12} sm={8}>
        <Card>
          <ErrorView
            error={error}
            retry={retry}
            allowRetry={!!allowRetry}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(PageError): Class<React.Component<void, ExternalProps, void>>);
