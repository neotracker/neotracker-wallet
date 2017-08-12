/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';

import {
  CopyField,
  PasswordField,
} from '~/src/wallet/shared/components/common';
import { PrintPaperWalletButton } from '~/src/wallet/shared/components/paper';
import { SaveOrGenerateKeystore } from '~/src/wallet/shared/components/keystore';
import type { UnlockedWallet } from '~/src/wallet/shared/wallet';

import * as walletAPI from '~/src/wallet/shared/wallet';

import InfoLabeled from './InfoLabeled';

const styleSheet = createStyleSheet('InfoView', theme => ({
  marginTop: {
    marginTop: theme.spacing.unit,
  },
  textField: {
    maxWidth: theme.spacing.unit * 70,
  },
}));

const ADDRESS_TOOLTIP =
  'Your Address can also be known as you Account # or your Public Key. ' +
  'It is what you share with people so they can send you NEO or GAS. ' +
  'Make sure it matches your paper wallet & whenever you enter your ' +
  'address somewhere.';
const KEYSTORE_TOOLTIP =
  'Your Keystore file stores your Private Key in an encrypted format using ' +
  'a password. It is recommended to always use the Keystore file to unlock ' +
  'your wallet.';
const PRIVATE_KEY_TOOLTIP =
  'This is the unencrypted text version of your private key, meaning no ' +
  'password is necessary. If someone were to find your unencrypted private ' +
  'key, they could access your wallet without a password. For this reason, ' +
  'encrypted versions such as the Keystore are typically recommended';
const PAPER_WALLET_TOOLTIP =
  'A paper wallet is a form of cold storage. Simply print it out and keep it ' +
  'somewhere safe.'

type ExternalProps = {|
  wallet: UnlockedWallet,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function InfoView({
  wallet,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={className}>
      <InfoLabeled
        label="Your Address"
        tooltip={ADDRESS_TOOLTIP}
        element={
          <CopyField
            className={classes.textField}
            disableMargin
            value={wallet.address}
            name="Address"
          />
        }
      />
      <InfoLabeled
        className={classes.marginTop}
        label="Keystore File (UTC / JSON - Recommended - Encrypted)"
        tooltip={KEYSTORE_TOOLTIP}
        element={
          <SaveOrGenerateKeystore wallet={wallet} />
        }
      />
      <InfoLabeled
        className={classes.marginTop}
        label="Your Private Key"
        tooltip={PRIVATE_KEY_TOOLTIP}
        element={
          <PasswordField
            className={classes.textField}
            disableMargin
            value={walletAPI.privateKeyToWIF(wallet.privateKey)}
            copyOnClickName="Private Key"
          />
        }
      />
      <InfoLabeled
        className={classes.marginTop}
        label="Print Paper Wallet"
        tooltip={PAPER_WALLET_TOOLTIP}
        element={
          <PrintPaperWalletButton
            address={wallet.address}
            privateKey={wallet.privateKey}
          />
        }
      />
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(InfoView): Class<React.Component<void, ExternalProps, void>>);
