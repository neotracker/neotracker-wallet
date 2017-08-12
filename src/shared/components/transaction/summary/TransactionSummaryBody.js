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

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import TransactionClaimSummaryBody from './TransactionClaimSummaryBody';
import TransactionEnrollmentSummaryBody from './TransactionEnrollmentSummaryBody';
import TransactionInputOutputSummaryBody from './TransactionInputOutputSummaryBody';
import TransactionPublishSummaryBody from './TransactionPublishSummaryBody';
import TransactionRegisterSummaryBody from './TransactionRegisterSummaryBody';
import {
  type TransactionSummaryBody_transaction,
} from './__generated__/TransactionSummaryBody_transaction.graphql';

const styleSheet = createStyleSheet('TransactionSummaryBody', theme => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      padding: theme.spacing.unit * 2,
    },
  },
  root: {
    borderBottom: `1px solid ${theme.palette.text.lightDivider}`,
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
  transaction: TransactionSummaryBody_transaction,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionSummaryBody({
  transaction,
  addressHash,
  dense,
  className,
  styleManager,
}: Props): ?React.Element<any> {
  const classes = styleManager.render(styleSheet);
  const rootClassName = classNames(classes.root, className);
  // $FlowFixMe
  const type = (transaction.type: TransactionType);
  const inputOutputSummary = (
    <TransactionInputOutputSummaryBody
      className={rootClassName}
      transaction={transaction}
      addressHash={addressHash}
      dense={dense}
    />
  );

  switch (type) {
    case 'MinerTransaction':
      return inputOutputSummary;
    case 'IssueTransaction':
      return inputOutputSummary;
    case 'ClaimTransaction':
      return (
        <TransactionClaimSummaryBody
          className={rootClassName}
          transaction={transaction}
          addressHash={addressHash}
          dense={dense}
        />
      );
    case 'EnrollmentTransaction':
      return (
        <TransactionEnrollmentSummaryBody
          className={rootClassName}
          transaction={transaction}
          addressHash={addressHash}
          dense={dense}
        />
      );
    case 'RegisterTransaction':
      return (
        <TransactionRegisterSummaryBody
          className={rootClassName}
          transaction={transaction}
          addressHash={addressHash}
          dense={dense}
        />
      );
    case 'ContractTransaction':
      return inputOutputSummary;
    case 'PublishTransaction':
      return (
        <TransactionPublishSummaryBody
          className={rootClassName}
          transaction={transaction}
          addressHash={addressHash}
          dense={dense}
        />
      );
    case 'InvocationTransaction':
      return inputOutputSummary;
    default:
      // eslint-disable-next-line
      (type: empty);
      return null;
  }
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    transaction: graphql`
      fragment TransactionSummaryBody_transaction on Transaction {
        type
        ...TransactionClaimSummaryBody_transaction
        ...TransactionEnrollmentSummaryBody_transaction
        ...TransactionInputOutputSummaryBody_transaction
        ...TransactionPublishSummaryBody_transaction
        ...TransactionRegisterSummaryBody_transaction
      }
    `,
  }),
  pure,
)(TransactionSummaryBody): Class<React.Component<void, ExternalProps, void>>);
