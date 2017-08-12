/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type TransactionInputOutputTable_input_outputs = $ReadOnlyArray<{|
  +address_hash: string;
  +value: string;
  +asset: {| |};
|}>;
*/


const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "TransactionInputOutputTable_input_outputs",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "address_hash",
      "storageKey": null
    },
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
          "kind": "FragmentSpread",
          "name": "AssetNameLink_asset",
          "args": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "TransactionInputOutput"
};

module.exports = fragment;
