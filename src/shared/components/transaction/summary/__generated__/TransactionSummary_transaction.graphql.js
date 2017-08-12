/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type TransactionSummary_transaction = {| |};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TransactionSummary_transaction",
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "TransactionSummaryHeader_transaction",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TransactionSummaryBody_transaction",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TransactionSummaryFooter_transaction",
      "args": null
    }
  ],
  "type": "Transaction"
};

module.exports = fragment;
