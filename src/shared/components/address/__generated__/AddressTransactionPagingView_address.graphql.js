/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type AddressTransactionPagingView_address = {|
  +hash: string;
  +transaction_count: number;
  +transactions: {|
    +edges: $ReadOnlyArray<{|
      +node: {| |};
    |}>;
    +pageInfo: {|
      +hasNextPage: boolean;
      +endCursor: ?string;
    |};
  |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": null
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "transactions"
        ]
      }
    ]
  },
  "name": "AddressTransactionPagingView_address",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "hash",
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "transaction_count",
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "transactions",
      "args": [
        {
          "kind": "Literal",
          "name": "orderBy",
          "value": [
            {
              "name": "transaction.block_time",
              "direction": "desc nulls first"
            },
            {
              "name": "transaction.index",
              "direction": "asc nulls last"
            },
            {
              "name": "transaction.id",
              "direction": "desc nulls last"
            }
          ],
          "type": "[OrderByInput!]"
        }
      ],
      "concreteType": "AddressToTransactionsConnection",
      "name": "__AddressTransactionPagingView_transactions_connection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "args": null,
          "concreteType": "AddressToTransactionsEdge",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "args": null,
              "concreteType": "Transaction",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "kind": "FragmentSpread",
                  "name": "TransactionPagingView_transactions",
                  "args": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "args": null,
              "name": "hasNextPage",
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "args": null,
              "name": "endCursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "__AddressTransactionPagingView_transactions_connection{\"orderBy\":[{\"direction\":\"desc nulls first\",\"name\":\"transaction.block_time\"},{\"direction\":\"asc nulls last\",\"name\":\"transaction.index\"},{\"direction\":\"desc nulls last\",\"name\":\"transaction.id\"}]}"
    }
  ],
  "type": "Address"
};

module.exports = fragment;
