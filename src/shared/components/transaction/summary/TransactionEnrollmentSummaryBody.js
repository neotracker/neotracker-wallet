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

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { AddressLink } from '~/src/shared/components/address/lib';
import {
  TransactionInputTable,
  TransactionOutputTable,
} from '~/src/shared/components/transaction/lib';
import {
  Typography,
} from '~/src/lib/components/shared/base';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type TransactionEnrollmentSummaryBody_transaction,
} from './__generated__/TransactionEnrollmentSummaryBody_transaction.graphql';
import TransactionSplitSummaryBody from './TransactionSplitSummaryBody';

const styleSheet = createStyleSheet('TransactionEnrollmentSummaryBody', (theme) => ({
  enrolledArea: {
    alignItems: 'center',
    display: 'flex',
    minWidth: '0',
  },
  enrolled: {
    marginRight: theme.spacing.unit,
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
  transaction: TransactionEnrollmentSummaryBody_transaction,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionEnrollmentSummaryBody({
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
  let enrolled;
  if (transaction.enrollment != null) {
    enrolled = (
      <div className={classes.enrolledArea}>
        <Typography
          className={classes.enrolled}
          type="body1"
        >
          Validator Enrolled:
        </Typography>
        <AddressLink addressHash={transaction.enrollment.address.hash} />
      </div>
    );
  }
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
      extraRight={enrolled}
      dense={dense}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    transaction: graphql`
      fragment TransactionEnrollmentSummaryBody_transaction on Transaction {
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
        enrollment {
          address {
            hash
          }
        }
      }
    `,
  }),
  pure,
)(TransactionEnrollmentSummaryBody): Class<React.Component<void, ExternalProps, void>>);
