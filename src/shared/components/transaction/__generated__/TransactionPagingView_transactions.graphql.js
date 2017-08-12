/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type TransactionPagingView_transactions = $ReadOnlyArray<{| |}>;
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "TransactionPagingView_transactions",
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "TransactionTable_transactions",
      "args": null
    }
  ],
  "type": "Transaction"
};

module.exports = fragment;
