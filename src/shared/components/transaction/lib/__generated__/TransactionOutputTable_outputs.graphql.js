/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type TransactionOutputTable_outputs = $ReadOnlyArray<{|
  +input_transaction_hash: ?string;
|}>;
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "TransactionOutputTable_outputs",
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
      "name": "input_transaction_hash",
      "storageKey": null
    }
  ],
  "type": "TransactionInputOutput"
};

module.exports = fragment;
