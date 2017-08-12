/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { type AppContext } from '~/src/shared/AppContext';

const styleSheet = createStyleSheet('PaperWalletHeader', () => ({
  root: {
  },
}));

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  styleManager: AppStyleManager,
  appContext: AppContext,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function PaperWalletHeader({
  className,
  styleManager,
  appContext,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <img
      alt="NEO Tracker"
      className={classNames(classes.root, className)}
      src={appContext.routes.makePublic('/paper-wallet-sidebar.png')}
      height="100%"
      width="auto"
    />
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    appContext: () => null,
  }),
  pure,
)(PaperWalletHeader): Class<React.Component<void, ExternalProps, void>>);
