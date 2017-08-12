/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type SendTransaction_address = {|
  +confirmed_coins: {|
    +edges: $ReadOnlyArray<{|
      +node: {|
        +value: string;
        +asset: {|
          +transaction_hash: string;
          +precision: number;
          +name: $ReadOnlyArray<{|
            +name: string;
            +lang: string;
          |}>;
        |};
      |};
    |}>;
  |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SendTransaction_address",
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
                      "kind": "ScalarField",
                      "alias": null,
                      "args": null,
                      "name": "precision",
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
                          "name": "name",
                          "storageKey": null
                        },
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "args": null,
                          "name": "lang",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Address"
};

module.exports = fragment;
