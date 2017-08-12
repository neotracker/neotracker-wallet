/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';
import { graphql } from 'react-relay';

import {
  TransactionSummary,
} from '~/src/shared/components/transaction/summary';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type TransactionTable_transactions,
} from './__generated__/TransactionTable_transactions.graphql';

type ExternalProps = {|
  transactions: any,
  addressHash?: string,
  dense?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transactions: TransactionTable_transactions,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionTable({
  transactions,
  addressHash,
  dense,
  className,
}: Props): React.Element<*> {
  return (
    <div className={className}>
      {transactions.map(transaction => (
        <TransactionSummary
          key={transaction.hash}
          transaction={transaction}
          addressHash={addressHash}
          dense={dense}
        />
      ))}
    </div>
  )
}

export default (compose(
  fragmentContainer({
    transactions: graphql`
      fragment TransactionTable_transactions on Transaction @relay(plural: true) {
        hash
        ...TransactionSummary_transaction
      }
    `
  }),
  pure,
)(TransactionTable): Class<React.Component<void, ExternalProps, void>>);
