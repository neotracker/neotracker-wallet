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

import TransactionSplitSummaryBodyDense from './TransactionSplitSummaryBodyDense';
import TransactionSplitSummaryBodyLR from './TransactionSplitSummaryBodyLR';

const styleSheet = createStyleSheet('TransactionSplitSummaryBody', theme => ({
  [theme.breakpoints.down('sm')]: {
    dense: {
      display: 'initial',
    },
    lr: {
      display: 'none',
    },
  },
  [theme.breakpoints.up('sm')]: {
    dense: {
      display: 'none',
    },
    lr: {
      display: 'initial',
    },
  },
  [theme.breakpoints.up('md')]: {
    denseDense: {
      display: 'initial',
    },
    denseLR: {
      display: 'none',
    },
  },
  [theme.breakpoints.up('lg')]: {
    denseDense: {
      display: 'none',
    },
    denseLR: {
      display: 'initial',
    },
  },
  dense: {},
  lr: {},
  denseDense: {},
  denseLR: {},
}));

type ExternalProps = {|
  left: any,
  right: any,
  extraRight?: any,
  dense?: boolean,
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
function TransactionSplitSummaryBody({
  left,
  right,
  extraRight,
  dense,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={className}>
      <div
        className={classNames({
          [classes.dense]: true,
          [classes.denseDense]: dense,
        })}
      >
        <TransactionSplitSummaryBodyDense
          left={left}
          right={right}
          extraRight={extraRight}
        />
      </div>
      <div
        className={classNames({
          [classes.lr]: true,
          [classes.denseLR]: dense,
        })}
      >
        <TransactionSplitSummaryBodyLR
          left={left}
          right={right}
          extraRight={extraRight}
        />
      </div>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(TransactionSplitSummaryBody): Class<React.Component<void, ExternalProps, void>>);
