/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type TransactionRegisterSummaryBody_transaction = {|
  +inputs: {|
    +edges: $ReadOnlyArray<{|
      +node: {| |};
    |}>;
  |};
  +outputs: {|
    +edges: $ReadOnlyArray<{|
      +node: {| |};
    |}>;
  |};
  +asset: ?{| |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TransactionRegisterSummaryBody_transaction",
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "args": null,
      "concreteType": "TransactionToInputsConnection",
      "name": "inputs",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "args": null,
          "concreteType": "TransactionToInputsEdge",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "args": null,
              "concreteType": "TransactionInputOutput",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "kind": "FragmentSpread",
                  "name": "TransactionInputTable_inputs",
                  "args": null
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
      "concreteType": "TransactionToOutputsConnection",
      "name": "outputs",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "args": null,
          "concreteType": "TransactionToOutputsEdge",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "args": null,
              "concreteType": "TransactionInputOutput",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "kind": "FragmentSpread",
                  "name": "TransactionOutputTable_outputs",
                  "args": null
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
      "concreteType": "Asset",
      "name": "asset",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "AssetNameLink_asset",
          "args": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Transaction"
};

module.exports = fragment;
