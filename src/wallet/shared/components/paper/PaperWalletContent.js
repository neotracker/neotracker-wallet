/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppContext } from '~/src/shared/AppContext';
import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { QRCode } from '~/src/lib/components/shared/qr';

import * as walletAPI from '~/src/wallet/shared/wallet';

import PaperWalletLabeled from './PaperWalletLabeled';
import PaperWalletLabelLine from './PaperWalletLabelLine';

const styleSheet = createStyleSheet('PaperWalletContent', theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit,
  },
  box: {
    height: theme.spacing.unit * 19,
    width: theme.spacing.unit * 19,
  },
  notes: {
    backgroundColor: theme.palette.background.contentFrame,
  },
  codes: {
    alignItems: 'center',
    display: 'flex',
  },
  lines: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  privateKey: {
    paddingTop: theme.spacing.unit,
  },
  firstBox: {
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
  },
  secondBox: {
    padding: theme.spacing.unit * 2,
  },
  thirdBox: {
    paddingBottom: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
  },
}));

const SIZE = 152;

type ExternalProps = {|
  address: string,
  privateKey: Buffer,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  appContext: AppContext,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function PaperWalletContent({
  address,
  privateKey,
  className,
  appContext,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const privateKeyHex = walletAPI.privateKeyToWIF(privateKey);
  const addressHex = address;
  return (
    <div className={classNames(className, classes.root)}>
      <div className={classes.codes}>
        <PaperWalletLabeled
          className={classes.firstBox}
          element={
            <QRCode
              alt="Address QR Code"
              size={SIZE}
              value={addressHex}
            />
          }
          label="YOUR ADDRESS"
        />
        <PaperWalletLabeled
          className={classes.secondBox}
          element={
            <img
              alt="Notes Area"
              src={appContext.routes.makePublic('/notes-bg.png')}
              width={`${SIZE}px`}
              height={`${SIZE}px`}
            />
          }
          label="AMOUNT / NOTES"
        />
        <PaperWalletLabeled
          className={classes.thirdBox}
          element={
            <QRCode
              alt="Private Key QR Code"
              size={SIZE}
              value={privateKeyHex}
            />
          }
          label="YOUR PRIVATE KEY"

        />
      </div>
      <div className={classes.lines}>
        <PaperWalletLabelLine
          value={addressHex}
          label="Your Address:"
        />
        <PaperWalletLabelLine
          className={classes.privateKey}
          value={privateKeyHex}
          label="Your Private Key:"
        />
      </div>
    </div>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    appContext: () => null,
  }),
  pure,
)(PaperWalletContent): Class<React.Component<void, ExternalProps, void>>);
