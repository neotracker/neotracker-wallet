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
import { DownArrow } from '~/src/shared/components/transaction/lib';


const styleSheet = createStyleSheet('TransactionSplitSummaryBodyDense', (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  col: {
    display: 'flex',
    flex: '1 1 auto',
  },
  arrow: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'center',
    marginBottom: theme.spacing.unit / 2,
    marginTop: theme.spacing.unit / 2,
  },
  divider: {
    backgroundColor: theme.palette.text.lightDivider,
    flex: '1 1 auto',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    height: 1,
  },
  right: {
    justifyContent: 'flex-end',
  },
  extraRight: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
  },
}));

type ExternalProps = {|
  left: any,
  right: any,
  extraRight?: any,
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
function TransactionSplitSummaryBodyDense({
  left,
  right: rightIn,
  extraRight,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let right = rightIn;
  if (extraRight != null) {
    right = (
      <div className={classes.extraRight}>
        {right}
        {extraRight}
      </div>
    );
  }
  return (
    <div className={classNames(className, classes.root)}>
      <div className={classes.col}>
        {left}
      </div>
      <div className={classes.arrow}>
        <div className={classes.divider} />
        <DownArrow />
        <div className={classes.divider} />
      </div>
      <div className={classNames(classes.col, classes.right)}>
        {right}
      </div>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(TransactionSplitSummaryBodyDense): Class<React.Component<void, ExternalProps, void>>);
