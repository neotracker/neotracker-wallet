/* @flow */
import React from 'react';

import {
  ANTSHARES_ASSET_HASH,
} from '~/src/lib/blockchain/shared/constants';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
  withHandlers,
  withProps,
  withPropsOnChange,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import { graphql } from 'react-relay';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Button,
  TextField,
  Typography,
} from '~/src/lib/components/shared/base';
import {
  Selector,
} from '~/src/lib/components/shared/selector';
import type { UnlockedWallet } from '~/src/wallet/shared/wallet';

import { confirmTransaction } from '~/src/wallet/shared/redux';
import { fragmentContainer } from '~/src/lib/graphql/shared/relay';
import { getName } from '~/src/shared/components/asset/lib';
import { getSortedCoins } from '~/src/shared/components/address/lib';
import log from '~/src/shared/log';
import * as walletAPI from '~/src/wallet/shared/wallet';

import {
  type SendTransaction_address,
} from './__generated__/SendTransaction_address.graphql';

const styleSheet = createStyleSheet('SendTransaction', theme => ({
  assetArea: {
    alignItems: 'center',
    display: 'flex',
    paddingTop: theme.spacing.unit,
  },
  selector: {
    flex: '0 0 auto',
  },
  marginLeft: {
    marginLeft: theme.spacing.unit,
  },
  buttonText: {
    color: theme.custom.colors.common.white,
  },
}));

type ExternalProps = {|
  wallet: UnlockedWallet,
  address: any,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  address: SendTransaction_address,
  coins: $ReadOnlyArray<{
    value: string,
    asset: {
      transaction_hash: string,
      precision: number,
      name: $ReadOnlyArray<{
        name: string,
        lang: string,
      }>,
    },
  }>,
  toAddress: string,
  toAddressValidation: ?string,
  amount: string,
  amountValidation: ?string,
  selectedAssetTransactionHash: string,
  onChangeAddress: (event: Object) => void,
  onChangeAmount: (event: Object) => void,
  onSelect: (option: Object) => void,
  onConfirmSend: () => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function SendTransaction({
  coins,
  className,
  toAddress,
  toAddressValidation,
  amount,
  amountValidation,
  selectedAssetTransactionHash,
  onChangeAddress,
  onChangeAmount,
  onSelect,
  onConfirmSend,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={className}>
      <TextField
        value={toAddress}
        error={toAddressValidation != null && toAddress !== ''}
        subtext={toAddress === '' ? null : toAddressValidation}
        hasSubtext
        onChange={onChangeAddress}
        label="To Address"
      />
      <div className={classes.assetArea}>
        <TextField
          value={amount}
          error={amountValidation != null && amount !== ''}
          subtext={amount === '' ? null : amountValidation}
          hasSubtext
          onChange={onChangeAmount}
          label="Amount"
        />
        <Selector
          className={classNames(classes.selector, classes.marginLeft)}
          id="select-asset"
          label="Select Asset"
          options={coins.map(coin => coin.asset).map(asset => ({
            id: asset.transaction_hash,
            text: getName(asset.name, asset.transaction_hash),
            asset,
          }))}
          selectedID={selectedAssetTransactionHash}
          selectText="Select Asset"
          onSelect={onSelect}
        />
        <Button
          className={classes.marginLeft}
          raised
          color="primary"
          disabled={toAddressValidation != null || amountValidation != null}
          onClick={onConfirmSend}
        >
          <Typography
            className={classes.buttonText}
            type="body1"
          >
            SEND
          </Typography>
        </Button>
      </div>
    </div>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    loggingContext: () => null,
  }),
  fragmentContainer({
    address: graphql`
      fragment SendTransaction_address on Address {
        confirmed_coins {
          edges {
            node {
              value
              asset {
                transaction_hash
                precision
                name {
                  name
                  lang
                }
              }
            }
          }
        }
      }
    `,
  }),
  withPropsOnChange(
    ['address'],
    ({ address }) => ({
      coins: getSortedCoins(
        address == null
          ? []
          : address.confirmed_coins.edges.map(edge => edge.node),
      ),
    })
  ),
  withState('state', 'setState', () => ({
    toAddress: '',
    toAddressValidation: null,
    amount: '',
    amountValidation: null,
    selectedAssetTransactionHash: ANTSHARES_ASSET_HASH,
  })),
  withProps(({ state }) => state),
  connect(null, dispatch => ({ dispatch })),
  withHandlers({
    onChangeAddress: ({ setState }) => (event) => {
      const toAddress = event.target.value;
      const toAddressValidation = walletAPI.validateAddress(toAddress);
      setState(prevState => ({
        ...prevState,
        toAddress,
        toAddressValidation,
      }));
    },
    onChangeAmount: ({
      setState,
      coins,
      selectedAssetTransactionHash,
    }) => (event) => {
      const amount = event.target.value;
      const amountValidation = walletAPI.validateAmount(
        amount,
        coins.find(
          coin => coin.asset.transaction_hash === selectedAssetTransactionHash,
        ),
      );
      setState(prevState => ({
        ...prevState,
        amount,
        amountValidation,
      }));
    },
    onSelect: ({ setState, amount, coins }) => (option) => {
      const selectedAssetTransactionHash = option.id;
      const amountValidation = walletAPI.validateAmount(
        amount,
        coins.find(
          coin => coin.asset.transaction_hash === selectedAssetTransactionHash,
        ),
      );
      setState(prevState => ({
        ...prevState,
        selectedAssetTransactionHash,
        amountValidation,
      }));
    },
    onConfirmSend: ({
      wallet,
      toAddress,
      amount,
      selectedAssetTransactionHash,
      coins,
      dispatch,
      loggingContext,
    }) => () => {
      const coin = coins.find(
        c => c.asset.transaction_hash === selectedAssetTransactionHash,
      );
      if (coin != null) {
        dispatch(confirmTransaction({
          wallet,
          address: toAddress,
          amount,
          asset: coin.asset,
        }));
        log({
          event: 'SEND_TRANSACTION_START',
          context: loggingContext,
        });
      }
    },
  }),
  pure,
)(SendTransaction): Class<React.Component<void, ExternalProps, void>>);
