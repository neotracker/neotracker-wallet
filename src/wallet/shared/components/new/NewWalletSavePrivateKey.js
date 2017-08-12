/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { CopyField } from '~/src/wallet/shared/components/common';
import { PrintPaperWalletButton } from '~/src/wallet/shared/components/paper';

import * as walletAPI from '~/src/wallet/shared/wallet';

import NewWalletSaveCommon from './NewWalletSaveCommon';

const styleSheet = createStyleSheet('NewWalletSavePrivateKey', theme => ({
  [theme.breakpoints.down('sm')]: {
    print: {
      paddingTop: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    print: {
      paddingTop: theme.spacing.unit * 2,
    },
  },
  print: {},
  save: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
  },
  copyField: {
    maxWidth: theme.spacing.unit * 70,
  },
}));


type ExternalProps = {|
  privateKey: Buffer,
  address: string,
  onContinue: () => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  privateKeySaved: boolean,
  onSave: () => void,
  onPrintPaperWallet: () => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function NewWalletSavePrivateKey({
  privateKey,
  address,
  onContinue,
  className,
  privateKeySaved,
  onSave,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <NewWalletSaveCommon
      className={className}
      title="Save Your Private Key"
      saveElement={
        <div className={classes.save}>
          <CopyField
            className={classes.copyField}
            value={walletAPI.privateKeyToWIF(privateKey)}
            name="Private Key"
            label="Private Key"
            onClick={onSave}
          />
          <PrintPaperWalletButton
            className={classes.print}
            address={address}
            privateKey={privateKey}
            onPrint={onSave}
          />
        </div>
      }
      saved={privateKeySaved}
      onContinue={onContinue}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
  withState('state', 'setState', () => ({
    privateKeySaved: false,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onSave: ({ setState }) => () => setState(prevState => ({
      ...prevState,
      privateKeySaved: true,
    })),
  }),
)(NewWalletSavePrivateKey): Class<React.Component<void, ExternalProps, void>>);
