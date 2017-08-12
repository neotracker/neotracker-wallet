/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';
import { graphql } from 'react-relay';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { PageLoading } from '~/src/shared/components/common/loading';
import {
  Typography,
} from '~/src/lib/components/shared/base';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import TransactionSummary from './TransactionSummary';
import {
  type TransactionSummaryList_transactions,
} from './__generated__/TransactionSummaryList_transactions.graphql';

const styleSheet = createStyleSheet('TransactionSummaryList', theme => ({
  [theme.breakpoints.down('sm')]: {
    summary: {
      marginTop: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    summary: {
      marginTop: theme.spacing.unit * 2,
    },
  },
  summary: {},
}));

type ExternalProps = {|
  transactions: any,
  loading?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transactions: TransactionSummaryList_transactions,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionSummaryList({
  transactions,
  loading,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);

  let content = <PageLoading />;
  if (!loading) {
    content = (
      transactions.map((transaction) => (
        <TransactionSummary
          key={transaction.hash}
          className={classes.summary}
          transaction={transaction}
        />
      ))
    );
  }

  return (
    <div className={className}>
      <div>
        <Typography
          type="title"
        >
          Transactions
        </Typography>
      </div>
      <div>
        {content}
      </div>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    transactions: graphql`
      fragment TransactionSummaryList_transactions on Transaction @relay(plural: true) {
        hash
        ...TransactionSummary_transaction
      }
    `
  }),
  pure,
)(TransactionSummaryList): Class<React.Component<void, ExternalProps, void>>);
