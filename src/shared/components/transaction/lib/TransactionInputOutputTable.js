/* @flow */
/* eslint-disable react/no-array-index-key */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';
import { graphql } from 'react-relay';

import { AddressLink } from '~/src/shared/components/address/lib';
import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { AssetNameLink } from '~/src/shared/components/asset/lib';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type TransactionInputOutputTable_input_outputs,
} from './__generated__/TransactionInputOutputTable_input_outputs.graphql';
import TransactionValue from './TransactionValue';

const styleSheet = createStyleSheet('TransactionInputOutputTable', theme => ({
  root: {
    display: 'flex',
    flex: '0 1 auto',
    maxWidth: '100%',
    minWidth: '0',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
  },
  margin: {
    marginRight: theme.spacing.unit,
  },
  value: {
    marginRight: theme.spacing.unit / 2,
    justifyContent: 'flex-end',
  },
  row: theme.custom.inputOutput.row,
  addressCol: {
    flex: '0 1 auto',
    minWidth: theme.spacing.unit * 4,
  },
  valueCol: {
    flex: '0 0 auto',
  },
  assetCol: {
    flex: '0 1 auto',
    minWidth: 36,
  },
  leftCol: {
    flex: '0 0 auto',
  },
  rightCol: {
    flex: '0 0 auto',
  },
}));

type ExternalProps = {|
  input_outputs: any,
  left?: any,
  right?: any,
  addressHash?: string,
  positive?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  input_outputs: TransactionInputOutputTable_input_outputs,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransactionInputOutputTable({
  input_outputs,
  left,
  right,
  addressHash,
  positive,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const addressLinks = [];
  const values = [];
  const assets = [];
  input_outputs.forEach((inputOutput, idx) => {
    addressLinks.push(
      <div key={idx} className={classNames(classes.margin, classes.row)}>
        <AddressLink
          addressHash={inputOutput.address_hash}
          highlighted={inputOutput.address_hash === addressHash}
        />
      </div>
    );
    values.push(
      <TransactionValue
        key={idx}
        negative={!positive}
        className={classNames(classes.row, classes.value)}
        value={inputOutput.value}
      />
    );
    assets.push(
      <AssetNameLink
        key={idx}
        className={classNames(
          right == null ? undefined : classes.margin,
          classes.row,
        )}
        asset={inputOutput.asset}
      />
    );
  });
  return (
    <div className={classNames(className, classes.root)}>
      {left == null
        ? null
        : <div className={classNames(classes.col, classes.leftCol)}>
          {left}
        </div>
      }
      <div className={classNames(classes.col, classes.addressCol)}>
        {addressLinks}
      </div>
      <div className={classNames(classes.col, classes.valueCol)}>
        {values}
      </div>
      <div className={classNames(classes.col, classes.assetCol)}>
        {assets}
      </div>
      {right == null
        ? null
        : <div className={classNames(classes.col, classes.rightCol)}>
          {right}
        </div>
      }
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    input_outputs: graphql`
      fragment TransactionInputOutputTable_input_outputs on TransactionInputOutput @relay(plural: true) {
        address_hash
        value
        asset {
          ...AssetNameLink_asset
        }
      }
    `,
  }),
  pure,
)(TransactionInputOutputTable): Class<React.Component<void, ExternalProps, void>>);
