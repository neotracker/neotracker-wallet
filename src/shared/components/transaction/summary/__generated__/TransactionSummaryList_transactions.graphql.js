/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type TransactionSummaryList_transactions = $ReadOnlyArray<{|
  +hash: string;
|}>;
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "TransactionSummaryList_transactions",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "hash",
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TransactionSummary_transaction",
      "args": null
    }
  ],
  "type": "Transaction"
};

module.exports = fragment;
