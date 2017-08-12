/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';
import { graphql } from 'react-relay';

import { PagingView } from '~/src/shared/components/common/view';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import TransactionTable from './TransactionTable';
import {
  type TransactionPagingView_transactions,
} from './__generated__/TransactionPagingView_transactions.graphql';

type ExternalProps = {|
  transactions: any,
  isInitialLoad?: boolean,
  isLoadingMore: boolean,
  error?: ?string,
  page: number,
  total: ?number,
  pageSize: number,
  onUpdatePage: (page: number) => void,
  addressHash?: string,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  transactions: TransactionPagingView_transactions,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionPagingView({
  transactions,
  isInitialLoad,
  isLoadingMore,
  error,
  page,
  total,
  pageSize,
  onUpdatePage,
  addressHash,
  className,
}: Props): React.Element<*> {
  return (
    <PagingView
      className={className}
      content={
        <TransactionTable
          transactions={transactions}
          addressHash={addressHash}
        />
      }
      isInitialLoad={isInitialLoad}
      isLoadingMore={isLoadingMore}
      error={error}
      page={page}
      total={total}
      pageSize={pageSize}
      onUpdatePage={onUpdatePage}
    />
  );
}

export default (compose(
  fragmentContainer({
    transactions: graphql`
      fragment TransactionPagingView_transactions on Transaction @relay(plural: true) {
        ...TransactionTable_transactions
      }
    `
  }),
  pure,
)(TransactionPagingView): Class<React.Component<void, ExternalProps, void>>);
