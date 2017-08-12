/* @flow */
/* eslint-disable react/no-array-index-key */
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
import { IconLink } from '~/src/lib/components/shared/link';
import { Typography } from '~/src/lib/components/shared/base';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';
import * as routes from '~/src/shared/routes';

import {
  type TransactionOutputTable_outputs
} from './__generated__/TransactionOutputTable_outputs.graphql';
import TransactionInputOutputTable from './TransactionInputOutputTable';

const styleSheet = createStyleSheet('TransactionOutput', theme => ({
  spent: {
    color: theme.custom.colors.red[500],
    marginRight: theme.spacing.unit,
  },
  spentArea: {
    alignItems: 'center',
    display: 'flex',
  },
  row: theme.custom.inputOutput.row,
}));

type ExternalProps = {|
  outputs: any,
  addressHash?: string,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  outputs: TransactionOutputTable_outputs,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
// TODO: INTL
function TransactionOutputTable({
  outputs,
  addressHash,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const links = outputs.map((output, idx) => {
    let link = (
      <Typography
        key={idx}
        type="body1"
        className={classes.row}
      >
        (Unspent)
      </Typography>
    );
    if (output.input_transaction_hash != null) {
      link = (
        <div
          key={idx}
          className={classNames(classes.spentArea, classes.row)}
        >
          <Typography type="body1" className={classes.spent}>
            (Spent)
          </Typography>
          <IconLink
            key={idx}
            icon="arrow_forward"
            path={routes.makeTransaction(output.input_transaction_hash)}
          />
        </div>
      );
    }
    return link;
  });
  return (
    <TransactionInputOutputTable
      className={className}
      input_outputs={outputs}
      right={links}
      addressHash={addressHash}
      positive
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    outputs: graphql`
      fragment TransactionOutputTable_outputs on TransactionInputOutput @relay(plural: true) {
        ...TransactionInputOutputTable_input_outputs
        input_transaction_hash
      }
    `
  }),
  pure,
)(TransactionOutputTable): Class<React.Component<void, ExternalProps, void>>);
