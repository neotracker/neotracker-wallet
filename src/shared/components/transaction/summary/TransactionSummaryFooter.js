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
import {
  Typography,
} from '~/src/lib/components/shared/base';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type TransactionSummaryFooter_transaction,
} from './__generated__/TransactionSummaryFooter_transaction.graphql';

const styleSheet = createStyleSheet('TransactionSummaryFooter', theme => ({
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
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
  },
  fee: {
    alignItems: 'center',
    display: 'flex',
  },
  margin: {
    marginRight: theme.spacing.unit,
  },
  font: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

type ExternalProps = {|
  transaction: any,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transaction: TransactionSummaryFooter_transaction,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
// TODO: INTL
function TransactionSummaryFooter({
  transaction,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={classNames(className, classes.root)}>
      <div className={classes.fee}>
        <Typography
          className={classNames(classes.margin, classes.font)}
          type="body1"
        >
          {`Network Fee: ${transaction.network_fee} GAS`}
        </Typography>
        <Typography className={classes.font} type="body1">
          {`System Fee: ${transaction.system_fee} GAS`}
        </Typography>
      </div>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    transaction: graphql`
      fragment TransactionSummaryFooter_transaction on Transaction {
        network_fee
        system_fee
      }
    `,
  }),
  pure,
)(TransactionSummaryFooter): Class<React.Component<void, ExternalProps, void>>);
