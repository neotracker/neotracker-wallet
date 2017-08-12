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

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';
import * as routes from '~/src/shared/routes';

import {
  type TransactionInputTable_inputs
} from './__generated__/TransactionInputTable_inputs.graphql';
import TransactionInputOutputTable from './TransactionInputOutputTable';

const styleSheet = createStyleSheet('TransactionInput', theme => ({
  row: theme.custom.inputOutput.row,
  margin: {
    marginRight: theme.spacing.unit,
  },
}));

type ExternalProps = {|
  inputs: any,
  addressHash?: string,
  positive?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  inputs: TransactionInputTable_inputs,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionInputTable({
  inputs,
  addressHash,
  positive,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const links = inputs.map((input, idx) => (
    <IconLink
      key={idx}
      className={classNames(classes.margin, classes.row)}
      icon="arrow_back"
      path={routes.makeTransaction(input.output_transaction_hash)}
    />
  ));
  return (
    <TransactionInputOutputTable
      className={className}
      input_outputs={inputs}
      left={links}
      addressHash={addressHash}
      positive={positive}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    inputs: graphql`
      fragment TransactionInputTable_inputs on TransactionInputOutput @relay(plural: true) {
        ...TransactionInputOutputTable_input_outputs
        output_transaction_hash
      }
    `
  }),
  pure,
)(TransactionInputTable): Class<React.Component<void, ExternalProps, void>>);
