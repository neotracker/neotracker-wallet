/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';
import { graphql } from 'react-relay';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { BlockTime } from '~/src/shared/components/block/lib';
import { Chevron } from '~/src/lib/components/shared/animated';
import {
  IconButton,
} from '~/src/lib/components/shared/base';
import {
  TransactionHeaderBackground,
  TransactionTypeAndLink,
} from '~/src/shared/components/transaction/lib';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type TransactionSummaryHeader_transaction
} from './__generated__/TransactionSummaryHeader_transaction.graphql';

const styleSheet = createStyleSheet('TransactionSummaryHeader', theme => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
  },
  root: {
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.lightDivider}`,
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
  },
  leftHeader: {
    flex: '1 100 auto',
    marginRight: theme.spacing.unit,
    minWidth: 150,
  },
  rightHeader: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 208px',
    justifyContent: 'flex-end',
    minWidth: '0',
  },
  // TODO: Keep in sync with ExpandoCard and/or extract out
  chevronButton: {
    width: theme.spacing.unit * 5,
    height: theme.spacing.unit * 5,
    marginBottom: -theme.spacing.unit,
    marginRight: -theme.spacing.unit,
    marginTop: -theme.spacing.unit,
  },
  blockTime: {
    marginRight: theme.spacing.unit,
  },
}));

type ExternalProps = {|
  transaction: any,
  showBody: boolean,
  onShowBody: () => void,
  onHideBody: () => void,
  alwaysExpand?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transaction: TransactionSummaryHeader_transaction,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionSummaryHeader({
  transaction,
  showBody,
  onShowBody,
  onHideBody,
  alwaysExpand,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let chevron = null;
  let onClickChevron;
  if (!alwaysExpand) {
    onClickChevron = showBody ? onHideBody : onShowBody;
    chevron = (
      <IconButton
        className={classes.chevronButton}
        onClick={onClickChevron}
      >
        <Chevron up={!showBody} />
      </IconButton>
    );
  }
  return (
    <TransactionHeaderBackground
      className={classNames(classes.root, className)}
      transaction={transaction}
      onClick={onClickChevron}
    >
      <TransactionTypeAndLink
        className={classes.leftHeader}
        transaction={transaction}
      />
      <div className={classes.rightHeader}>
        <BlockTime
          className={classes.blockTime}
          blockTime={transaction.block_time}
        />
        {chevron}
      </div>
    </TransactionHeaderBackground>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    transaction: graphql`
      fragment TransactionSummaryHeader_transaction on Transaction {
        ...TransactionHeaderBackground_transaction
        ...TransactionTypeAndLink_transaction
        type
        block_time
      }
    `
  }),
  pure,
)(TransactionSummaryHeader): Class<React.Component<void, ExternalProps, void>>);
