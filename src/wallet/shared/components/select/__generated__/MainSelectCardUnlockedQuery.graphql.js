/**
 * @flow
 * @relayHash 11468dbc4ff297e6428500993d511f5f
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type MainSelectCardUnlockedQueryResponse = {|
  +address: ?{| |};
|};
*/


/*
query MainSelectCardUnlockedQuery(
  $hash: String!
) {
  address(hash: $hash) {
    ...SelectCard_address
    id
  }
}

fragment SelectCard_address on Address {
  ...AccountView_address
}

fragment AccountView_address on Address {
  ...AccountViewBase_address
}

fragment AccountViewBase_address on Address {
  confirmed_coins {
    edges {
      node {
        ...CoinTable_coins
        id
      }
    }
  }
  claim_value_available_coin {
    value
    id
  }
}

fragment CoinTable_coins on Coin {
  value
  asset {
    transaction_hash
    name {
      lang
      name
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
    "name": "MainSelectCardUnlockedQuery",
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
        "concreteType": "Address",
        "name": "address",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SelectCard_address",
            "args": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "id": "35",
  "kind": "Batch",
  "metadata": {},
  "name": "MainSelectCardUnlockedQuery",
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
    "name": "MainSelectCardUnlockedQuery",
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
        "concreteType": "Address",
        "name": "address",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "AddressToConfirmedCoinsConnection",
            "name": "confirmed_coins",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "AddressToConfirmedCoinsEdge",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "Coin",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "id",
                        "storageKey": null
                      },
                      {
                        "kind": "InlineFragment",
                        "type": "Coin",
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "value",
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "name": "asset",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "transaction_hash",
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "AssetName",
                                "name": "name",
                                "plural": true,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "lang",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "name",
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
                      }
                    ],
                    "storageKey": null
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
            "concreteType": "Coin",
            "name": "claim_value_available_coin",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "value",
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
