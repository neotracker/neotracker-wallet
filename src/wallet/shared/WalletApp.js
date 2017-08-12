/* @flow */
import Helmet from 'react-helmet';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';
import { withRouter } from 'react-router';

import type { AppContext } from '~/src/shared/AppContext';
import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  CardView,
} from '~/src/lib/components/shared/layout';
import { Error404 } from '~/src/lib/components/shared/error';
import {
  CreateKeystore,
  MainWallet,
  NewWallet,
  OpenWallet,
  WalletFAQ,
} from '~/src/wallet/shared/pages';
import {
  SendTransactionDialog,
} from '~/src/wallet/shared/components/account';
import {
  Typography,
} from '~/src/lib/components/shared/base';
import { type WalletContext } from '~/src/wallet/shared/WalletContext';

import * as routes from '~/src/wallet/shared/routes';

const styleSheet = createStyleSheet('WalletApp', (theme) => ({
  [theme.breakpoints.down('sm')]: {
    padding: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    padding: {
      padding: theme.spacing.unit * 2,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  contentInner: {
    flex: '1 1 auto',
  },
  padding: {},
}));

const renderComponent = Component => (props: Object) =>
  // $FlowFixMe
  <Component {...props} />;

export type RouteConfig = {
  exact: boolean,
  path: string,
  render: (props: Props) => React.Element<any>,
};
export const routeConfigs = [
  {
    exact: true,
    path: routes.HOME,
    render: renderComponent(MainWallet),
  },
  {
    exact: true,
    path: routes.CREATE_KEYSTORE,
    render: renderComponent(CreateKeystore),
  },
  {
    exact: true,
    path: routes.NEW_WALLET,
    render: renderComponent(NewWallet),
  },
  {
    exact: true,
    path: routes.OPEN_WALLET,
    render: renderComponent(OpenWallet),
  },
  {
    exact: true,
    path: routes.WALLET_FAQ,
    render: renderComponent(WalletFAQ),
  },
  {
    exact: false,
    path: undefined,
    render: renderComponent(Error404),
  },
];

type ExternalProps = {|
  children?: any,
|};
// eslint-disable-next-line
type InternalProps = {|
  match: Object,
  appContext: AppContext,
  walletContext: WalletContext,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function WalletApp({
  styleManager,
  appContext,
  walletContext,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let content = (
    <CardView title="Wallet">
      <div className={classes.padding}>
        <Typography type="body1">
          NEO Tracker Wallet is currently down for maintenance.
        </Typography>
      </div>
    </CardView>
  );
  if (appContext.feature.wallet.enabled) {
    content = (
      <Switch>
        {routeConfigs.map(config => (
          <Route
            key={config.path || 'nopath'}
            exact={config.exact}
            path={
              config.path == null
                ? undefined
                : routes.makePath(walletContext, config.path)
            }
            render={config.render}
          />
        ))}
      </Switch>
    );
  }
  return (
    <div>
      <Helmet><title>{'Wallet'}</title></Helmet>
      <div className={classes.content}>
        {content}
      </div>
      <SendTransactionDialog />
    </div>
  );
}
export default (compose(
  getContext({
    styleManager: () => null,
    appContext: () => null,
    walletContext: () => null,
  }),
  withRouter,
  pure,
)(WalletApp): Class<React.Component<void, ExternalProps, void>>);
