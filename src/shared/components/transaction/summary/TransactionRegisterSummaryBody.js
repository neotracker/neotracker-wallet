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

import { AssetNameLink } from '~/src/shared/components/asset/lib';
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
  type TransactionRegisterSummaryBody_transaction,
} from './__generated__/TransactionRegisterSummaryBody_transaction.graphql';
import TransactionSplitSummaryBody from './TransactionSplitSummaryBody';

const styleSheet = createStyleSheet('TransactionRegisterSummaryBody', (theme) => ({
  registeredArea: {
    alignItems: 'center',
    display: 'flex',
    minWidth: '0',
  },
  registered: {
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
  transaction: TransactionRegisterSummaryBody_transaction,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionRegisterSummaryBody({
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
  const registered = (
    <div className={classes.registeredArea}>
      <Typography
        className={classes.registered}
        type="body1"
      >
        Registered
      </Typography>
      <AssetNameLink asset={transaction.asset} />
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
      extraRight={registered}
      dense={dense}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    transaction: graphql`
      fragment TransactionRegisterSummaryBody_transaction on Transaction {
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
        asset {
          ...AssetNameLink_asset
        }
      }
    `,
  }),
  pure,
)(TransactionRegisterSummaryBody): Class<React.Component<void, ExternalProps, void>>);
