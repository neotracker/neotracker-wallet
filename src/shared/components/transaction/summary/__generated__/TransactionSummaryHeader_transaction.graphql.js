/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type TransactionSummaryHeader_transaction = {|
  +type: string;
  +block_time: ?number;
|};
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TransactionSummaryHeader_transaction",
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "TransactionHeaderBackground_transaction",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "TransactionTypeAndLink_transaction",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "type",
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "block_time",
      "storageKey": null
    }
  ],
  "type": "Transaction"
};

module.exports = fragment;
