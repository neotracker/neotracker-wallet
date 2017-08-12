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
  Icon,
  Typography,
} from '~/src/lib/components/shared/base';
import Link, { type Type } from '~/src/lib/components/shared/link/Link';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';
import * as routes from '~/src/shared/routes';

import {
  type TransactionTypeAndLink_transaction,
} from './__generated__/TransactionTypeAndLink_transaction.graphql';

import getIcon from './getIcon';
import getTitle from './getTitle';

const styleSheet = createStyleSheet('TransactionTypeAndLink', theme => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    minWidth: '148.63px',
  },
  title: {
    maxWidth: '76.63px',
    width: '76.63px',
    minWidth: '76.63px',
  },
  margin: {
    marginRight: theme.spacing.unit,
  },
}));

type ExternalProps = {|
  transaction: any,
  titleComponent?: string,
  titleType?: Type,
  hashComponent?: string,
  hashType?: Type,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transaction: TransactionTypeAndLink_transaction,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionTypeAndLink({
  transaction,
  titleComponent,
  titleType,
  hashComponent,
  hashType,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const icon = getIcon((transaction.type: any));
  const title = getTitle((transaction.type: any));
  return (
    <div className={classNames(classes.root, className)}>
      <Icon className={classes.margin}>{icon}</Icon>
      <Typography
        className={classNames(classes.title, classes.margin)}
        component={titleComponent}
        type={titleType || "subheading"}
      >
        {title}
      </Typography>
      <Link
        component={hashComponent}
        type={hashType || "body1"}
        path={routes.makeTransaction(transaction.hash)}
        title={transaction.hash}
      />
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    transaction: graphql`
      fragment TransactionTypeAndLink_transaction on Transaction {
        type
        hash
      }
    `,
  }),
  pure,
)(TransactionTypeAndLink): Class<React.Component<void, ExternalProps, void>>);
