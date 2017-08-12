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
import { LinearProgress } from '~/src/lib/components/shared/base';
import { Logo } from '~/src/shared/components/common/logo';

const styleSheet = createStyleSheet('PageLoading', theme => ({
  [theme.breakpoints.down('md')]: {
    padding: {
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
    },
  },
  [theme.breakpoints.up('md')]: {
    padding: {
      paddingTop: theme.spacing.unit * 3,
      paddingBottom: theme.spacing.unit * 3,
    },
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  padding: {},
  progress: {
    marginTop: theme.spacing.unit * 2,
    width: theme.spacing.unit * 16,
  },
}));

type ExternalProps = {|
  disablePadding?: boolean,
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
function PageLoading({
  disablePadding,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={classNames(classes.root, className, {
      [classes.padding]: !disablePadding,
    })}>
      <Logo width={48} height={56} />
      <LinearProgress className={classes.progress} />
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(PageLoading): Class<React.Component<void, ExternalProps, void>>);
