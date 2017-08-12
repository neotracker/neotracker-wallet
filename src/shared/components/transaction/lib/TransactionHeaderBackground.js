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
import { type TransactionType } from '~/src/lib/blockchain/shared/constants';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type TransactionHeaderBackground_transaction
} from './__generated__/TransactionHeaderBackground_transaction.graphql';

const styleSheet = createStyleSheet('TransactionHeaderBackground', theme => ({
  contract: {
    borderLeft: `2px solid ${theme.custom.transactionColors.contract.backgroundColor}`,
  },
  miner: {
    borderLeft: `2px solid ${theme.custom.transactionColors.miner.backgroundColor}`,
  },
  issue: {
    borderLeft: `2px solid ${theme.custom.transactionColors.issue.backgroundColor}`,
  },
  claim: {
    borderLeft: `2px solid ${theme.custom.transactionColors.claim.backgroundColor}`,
  },
  enrollment: {
    borderLeft: `2px solid ${theme.custom.transactionColors.enrollment.backgroundColor}`,
  },
  register: {
    borderLeft: `2px solid ${theme.custom.transactionColors.register.backgroundColor}`,
  },
  publish: {
    borderLeft: `2px solid ${theme.custom.transactionColors.publish.backgroundColor}`,
  },
  invocation: {
    borderLeft: `2px solid ${theme.custom.transactionColors.invocation.backgroundColor}`,
  },
  contractBG: {
    backgroundColor: theme.custom.transactionColors.contract.backgroundColor,
  },
  minerBG: {
    backgroundColor: theme.custom.transactionColors.miner.backgroundColor,
  },
  issueBG: {
    backgroundColor: theme.custom.transactionColors.issue.backgroundColor,
  },
  claimBG: {
    backgroundColor: theme.custom.transactionColors.claim.backgroundColor,
  },
  enrollmentBG: {
    backgroundColor: theme.custom.transactionColors.enrollment.backgroundColor,
  },
  registerBG: {
    backgroundColor: theme.custom.transactionColors.register.backgroundColor,
  },
  publishBG: {
    backgroundColor: theme.custom.transactionColors.publish.backgroundColor,
  },
  invocationBG: {
    backgroundColor: theme.custom.transactionColors.invocation.backgroundColor,
  },
  pointer: {
    cursor: 'pointer',
  },
}));

export const getBackgroundClassName = (type: TransactionType) => {
  const classes = (styleSheet: any);
  let bgColorClass;
  switch (type) {
    case 'MinerTransaction':
      bgColorClass = classes.minerBG;
      break;
    case 'IssueTransaction':
      bgColorClass = classes.issueBG;
      break;
    case 'ClaimTransaction':
      bgColorClass = classes.claimBG;
      break;
    case 'EnrollmentTransaction':
      bgColorClass = classes.enrollmentBG;
      break;
    case 'RegisterTransaction':
      bgColorClass = classes.registerBG;
      break;
    case 'ContractTransaction':
      bgColorClass = classes.contractBG;
      break;
    case 'PublishTransaction':
      bgColorClass = classes.publishBG;
      break;
    case 'InvocationTransaction':
      bgColorClass = classes.invocationBG;
      break;
    default:
      // eslint-disable-next-line
      (type: empty);
      break;
  }
  return bgColorClass;
};

const getBorderClassName = (type: TransactionType) => {
  const classes = (styleSheet: any);
  let borderClass;
  switch (type) {
    case 'MinerTransaction':
      borderClass = classes.miner;
      break;
    case 'IssueTransaction':
      borderClass = classes.issue;
      break;
    case 'ClaimTransaction':
      borderClass = classes.claim;
      break;
    case 'EnrollmentTransaction':
      borderClass = classes.enrollment;
      break;
    case 'RegisterTransaction':
      borderClass = classes.register;
      break;
    case 'ContractTransaction':
      borderClass = classes.contract;
      break;
    case 'PublishTransaction':
      borderClass = classes.publish;
      break;
    case 'InvocationTransaction':
      borderClass = classes.invocation;
      break;
    default:
      // eslint-disable-next-line
      (type: empty);
      break;
  }
  return borderClass;
};

type ExternalProps = {|
  transaction: any,
  onClick?: () => void,
  children?: any,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transaction: TransactionHeaderBackground_transaction,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionHeaderBackground({
  transaction,
  onClick,
  children,
  className,
  styleManager,
}: Props): React.Element<*> {
  // eslint-disable-next-line
  const classes = styleManager.render(styleSheet);
  return (
    <div
      role="presentation"
      className={classNames(
        getBorderClassName((transaction.type: any)),
        className,
        {
          [classes.pointer]: onClick != null,
        },
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    transaction: graphql`
      fragment TransactionHeaderBackground_transaction on Transaction {
        type
      }
    `
  }),
  pure,
)(TransactionHeaderBackground): Class<React.Component<void, ExternalProps, void>>);
