/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type TransactionPublishSummaryBody_transaction = {|
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
  +contract: ?{| |};
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TransactionPublishSummaryBody_transaction",
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
      "concreteType": "Contract",
      "name": "contract",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "ContractNameLink_contract",
          "args": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Transaction"
};

module.exports = fragment;
