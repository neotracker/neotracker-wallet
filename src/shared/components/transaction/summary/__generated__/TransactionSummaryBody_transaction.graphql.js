/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type TransactionSummaryBody_transaction = {|
  +type: string;
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TransactionSummaryBody_transaction",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "type",
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TransactionClaimSummaryBody_transaction",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TransactionEnrollmentSummaryBody_transaction",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TransactionInputOutputSummaryBody_transaction",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TransactionPublishSummaryBody_transaction",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TransactionRegisterSummaryBody_transaction",
      "args": null
    }
  ],
  "type": "Transaction"
};

module.exports = fragment;
