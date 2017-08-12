/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
  withContext,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppContext } from '~/src/shared/AppContext';
import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';

import PaperWalletHeader from './PaperWalletHeader';
import PaperWalletContent from './PaperWalletContent';

const styleSheet = createStyleSheet('PaperWallet', (theme) => ({
  root: {
    border: `1px solid ${theme.palette.text.lightDivider}`,
    display: 'flex',
    height: 290,
    width: 739,
    boxSizing: 'border-box',
  },
}));

type ExternalProps = {|
  appContext: AppContext,
  address: string,
  privateKey: Buffer,
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
function PaperWallet({
  address,
  privateKey,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={classNames(className, classes.root)}>
      <PaperWalletHeader />
      <PaperWalletContent address={address} privateKey={privateKey} />
    </div>
  );
}

export default (compose(
  withContext(
    { appContext: () => null },
    ({ appContext }) => ({ appContext }),
  ),
  getContext({ styleManager: () => null }),
  pure,
)(PaperWallet): Class<React.Component<void, ExternalProps, void>>);
