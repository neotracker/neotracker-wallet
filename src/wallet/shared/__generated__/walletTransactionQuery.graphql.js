/**
 * @flow
 * @relayHash ebb2a9ecaf01adfd43fbc45b53d7296a
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type walletTransactionQueryResponse = {|
  +transaction: ?{|
    +block: ?{|
      +index: number;
    |};
  |};
|};
*/


/*
query walletTransactionQuery(
  $hash: String!
) {
  transaction(hash: $hash) {
    block {
      index
      id
    }
    id
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "hash",
        "type": "String!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "walletTransactionQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "hash",
            "variableName": "hash",
            "type": "String!"
          }
        ],
        "concreteType": "Transaction",
        "name": "transaction",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Block",
            "name": "block",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "index",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "id": "29",
  "kind": "Batch",
  "metadata": {},
  "name": "walletTransactionQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "hash",
        "type": "String!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "walletTransactionQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "hash",
            "variableName": "hash",
            "type": "String!"
          }
        ],
        "concreteType": "Transaction",
        "name": "transaction",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Block",
            "name": "block",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "index",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": null
};

module.exports = batch;
