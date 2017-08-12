/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type TransactionInputTable_inputs = $ReadOnlyArray<{|
  +output_transaction_hash: string;
|}>;
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "TransactionInputTable_inputs",
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "TransactionInputOutputTable_input_outputs",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "output_transaction_hash",
      "storageKey": null
    }
  ],
  "type": "TransactionInputOutput"
};

module.exports = fragment;
