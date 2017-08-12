/* @flow */
import React from 'react';

import {
  compose,
  pure,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { graphql } from 'react-relay';

import { Collapse } from '~/src/lib/components/shared/base';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type TransactionSummary_transaction,
} from './__generated__/TransactionSummary_transaction.graphql';
import TransactionSummaryBody from './TransactionSummaryBody';
import TransactionSummaryFooter from './TransactionSummaryFooter';
import TransactionSummaryHeader from './TransactionSummaryHeader';

type ExternalProps = {|
  transaction: any,
  addressHash?: string,
  initialShowBody?: boolean,
  alwaysExpand?: boolean,
  dense?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transaction: TransactionSummary_transaction,
  showBody: boolean,
  onShowBody: () => void,
  onHideBody: () => void,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionSummary({
  transaction,
  addressHash,
  alwaysExpand,
  dense,
  className,
  showBody,
  onShowBody,
  onHideBody,
}: Props): React.Element<*> {
  return (
    <div className={className}>
      <TransactionSummaryHeader
        transaction={transaction}
        showBody={showBody}
        onShowBody={onShowBody}
        onHideBody={onHideBody}
        alwaysExpand={alwaysExpand}
      />
      <Collapse
        in={showBody || alwaysExpand}
        transitionDuration="auto"
      >
        <TransactionSummaryBody
          transaction={transaction}
          addressHash={addressHash}
          dense={dense}
        />
        <TransactionSummaryFooter
          transaction={transaction}
        />
      </Collapse>
    </div>
  );
}

export default (compose(
  fragmentContainer({
    transaction: graphql`
      fragment TransactionSummary_transaction on Transaction {
        ...TransactionSummaryHeader_transaction
        ...TransactionSummaryBody_transaction
        ...TransactionSummaryFooter_transaction
      }
    `,
  }),
  withState('state', 'setState', ({ initialShowBody }) => ({
    showBody: initialShowBody || false,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onShowBody: ({ setState }) => () => setState(prevState => ({
      ...prevState,
      showBody: true,
    })),
    onHideBody: ({ setState }) => () => setState(prevState => ({
      ...prevState,
      showBody: false,
    })),
  }),
  pure,
)(TransactionSummary): Class<React.Component<void, ExternalProps, void>>);
