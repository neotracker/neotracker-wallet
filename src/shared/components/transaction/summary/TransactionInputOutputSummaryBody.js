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
  type TransactionInputOutputSummaryBody_transaction,
} from './__generated__/TransactionInputOutputSummaryBody_transaction.graphql';
import TransactionSplitSummaryBody from './TransactionSplitSummaryBody';

type ExternalProps = {|
  transaction: any,
  addressHash?: string,
  dense?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transaction: TransactionInputOutputSummaryBody_transaction,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionInputOutputSummaryBody({
  transaction,
  addressHash,
  dense,
  className,
}: Props): ?React.Element<*> {
  if (
    transaction.inputs.edges.length === 0 &&
    transaction.outputs.edges.length === 0
  ) {
    return null;
  }

  const input = (
    <TransactionInputTable
      inputs={transaction.inputs.edges.map(edge => edge.node)}
      addressHash={addressHash}
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
      fragment TransactionInputOutputSummaryBody_transaction on Transaction {
        inputs {
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
)(TransactionInputOutputSummaryBody): Class<React.Component<void, ExternalProps, void>>);
