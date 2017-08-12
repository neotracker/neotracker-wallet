/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { graphql } from 'react-relay';

import { TransactionPagingView } from '~/src/shared/components/transaction'

import { getPagingStartEnd } from '~/src/shared/components/common/view';
import { paginationContainer } from '~/src/shared/graphql/relay';

import {
  type AddressTransactionPagingView_address,
} from './__generated__/AddressTransactionPagingView_address.graphql';

const PAGE_SIZE = 10;

type ExternalProps = {|
  address: any,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  address: ?AddressTransactionPagingView_address,
  page: number,
  isLoadingMore: boolean,
  error: ?string,
  onUpdatePage: (page: number) => void,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function AddressTransactionPagingView({
  address,
  className,
  page,
  isLoadingMore,
  error,
  onUpdatePage,
}: Props): React.Element<*> {
  const { start, end, pageOut } = getPagingStartEnd({
    page,
    pageSize: PAGE_SIZE,
    isLoadingMore,
  });
  let transactions = [];
  let total = 0;
  let addressHash;
  if (address != null) {
    transactions = address.transactions.edges.slice(start, end)
      .map(edge => edge.node);
    total = address.transaction_count;
    addressHash = address.hash;
  }
  return (
    <TransactionPagingView
      className={className}
      transactions={transactions}
      isLoadingMore={isLoadingMore}
      error={error}
      page={pageOut}
      total={total}
      pageSize={PAGE_SIZE}
      onUpdatePage={onUpdatePage}
      addressHash={addressHash}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  paginationContainer({
    address: graphql.experimental`
      fragment AddressTransactionPagingView_address on Address @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
      ) {
        hash
        transaction_count
        transactions(
          first: $count,
          after: $cursor,
          orderBy: [{
            name: "transaction.block_time",
            direction: "desc nulls first",
          }, {
            name: "transaction.index",
            direction: "asc nulls last",
          }, {
            name: "transaction.id",
            direction: "desc nulls last",
          }]
        ) @connection(key: "AddressTransactionPagingView_transactions") {
          edges {
            node {
              ...TransactionPagingView_transactions
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
  }, {
    getVariables({ address }, { count, cursor }) {
      return { hash: address.hash, count, cursor };
    },
    query: graphql.experimental`
      query AddressTransactionPagingViewPaginationQuery(
        $hash: String!
        $count: Int!,
        $cursor: String
      ) {
        address(hash: $hash) {
          ...AddressTransactionPagingView_address @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }, {
    pageSize: PAGE_SIZE,
  }),
  withState('state', 'setState', () => ({
    page: 1,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onUpdatePage: ({ address, setState, onLoadMore }) => page => {
      if (address.transactions.edges.length < (page * PAGE_SIZE)) {
        onLoadMore();
      }
      setState(prevState => ({ ...prevState, page }));
    },
  }),
  pure,
)(AddressTransactionPagingView): Class<React.Component<void, ExternalProps, void>>);
