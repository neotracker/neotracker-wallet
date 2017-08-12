/* @flow */
/* eslint-disable react/no-array-index-key */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { graphql } from 'react-relay';
import { createStyleSheet } from 'jss-theme-reactor';

import { ContractNameLink } from '~/src/shared/components/contract/lib';
import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  TransactionInputTable,
  TransactionOutputTable,
} from '~/src/shared/components/transaction/lib';
import {
  Typography,
} from '~/src/lib/components/shared/base';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type TransactionPublishSummaryBody_transaction,
} from './__generated__/TransactionPublishSummaryBody_transaction.graphql';
import TransactionSplitSummaryBody from './TransactionSplitSummaryBody';

const styleSheet = createStyleSheet('TransactionPublishSummaryBody', () => ({
  output: {
    alignItems: 'center',
    display: 'flex',
    minWidth: '0',
  },
}));

type ExternalProps = {|
  transaction: any,
  addressHash?: string,
  dense?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transaction: TransactionPublishSummaryBody_transaction,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionPublishSummaryBody({
  transaction,
  addressHash,
  dense,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const input = (
    <TransactionInputTable
      inputs={transaction.inputs.edges.map(edge => edge.node)}
      addressHash={addressHash}
    />
  );
  const published = (
    <div className={classes.output}>
      <Typography type="body1">
        Published&nbsp;
      </Typography>
      <ContractNameLink contract={transaction.contract} />
    </div>
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
      extraRight={published}
      dense={dense}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    transaction: graphql`
      fragment TransactionPublishSummaryBody_transaction on Transaction {
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
        contract {
          ...ContractNameLink_contract
        }
      }
    `,
  }),
  pure,
)(TransactionPublishSummaryBody): Class<React.Component<void, ExternalProps, void>>);
