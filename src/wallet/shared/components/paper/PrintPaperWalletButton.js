/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
  withHandlers,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Button,
  Typography,
} from '~/src/lib/components/shared/base';

import { createPaperWallet } from '~/src/wallet/shared/components/paper';

const styleSheet = createStyleSheet('PrintPaperWalletButton', theme => ({
  buttonText: {
    color: theme.custom.colors.common.white,
  },
}));

type ExternalProps = {|
  privateKey: Buffer,
  address: string,
  onPrint?: () => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  onPrintPaperWallet: () => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function PrintPaperWalletButton({
  className,
  onPrintPaperWallet,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <Button
      className={className}
      raised
      color="primary"
      onClick={onPrintPaperWallet}
    >
      <Typography className={classes.buttonText} type="body1">
        PRINT PAPER WALLET
      </Typography>
    </Button>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    walletContext: () => null,
    appContext: () => null,
    loggingContext: () => null,
  }),
  withHandlers({
    onPrintPaperWallet: ({
      onPrint,
      privateKey,
      address,
      styleManager,
      walletContext,
      appContext,
      loggingContext,
    }) => () => {
      createPaperWallet({
        privateKey,
        address,
        styleManager,
        walletContext,
        appContext,
        loggingContext,
      });
      if (onPrint != null) {
        onPrint();
      }
    },
  }),
  pure,
)(PrintPaperWalletButton): Class<React.Component<void, ExternalProps, void>>);
