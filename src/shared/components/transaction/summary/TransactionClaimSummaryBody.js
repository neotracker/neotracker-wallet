/* @flow */
/* eslint-disable react/no-array-index-key */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';
import { graphql } from 'react-relay';

import {
  TransactionInputTable,
  TransactionOutputTable,
} from '~/src/shared/components/transaction/lib';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type TransactionClaimSummaryBody_transaction,
} from './__generated__/TransactionClaimSummaryBody_transaction.graphql';
import TransactionSplitSummaryBody from './TransactionSplitSummaryBody';

type ExternalProps = {|
  transaction: any,
  addressHash?: string,
  dense?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transaction: TransactionClaimSummaryBody_transaction,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionClaimSummaryBody({
  transaction,
  addressHash,
  dense,
  className,
}: Props): ?React.Element<*> {
  if (
    transaction.claims.edges.length === 0 &&
    transaction.outputs.edges.length === 0
  ) {
    return null;
  }

  const input = (
    <TransactionInputTable
      inputs={
        transaction.claims.edges
          .concat(transaction.duplicate_claims.edges)
          .map(edge => edge.node)
      }
      addressHash={addressHash}
      positive
    />
  );
  const output = (
    <TransactionOutputTable
      outputs={transaction.outputs.edges.map(edge => edge.node)}
      addressHash={addressHash}
    />
  );
  return (
    <TransactionSplitSummaryBody
      className={className}
      left={input}
      right={output}
      dense={dense}
    />
  );
}

export default (compose(
  fragmentContainer({
    transaction: graphql`
      fragment TransactionClaimSummaryBody_transaction on Transaction {
        duplicate_claims {
          edges {
            node {
              ...TransactionInputTable_inputs
            }
          }
        }
        claims {
          edges {
            node {
              ...TransactionInputTable_inputs
            }
          }
        }
        outputs {
          edges {
            node {
              ...TransactionOutputTable_outputs
            }
          }
        }
      }
    `,
  }),
  pure,
)(TransactionClaimSummaryBody): Class<React.Component<void, ExternalProps, void>>);
