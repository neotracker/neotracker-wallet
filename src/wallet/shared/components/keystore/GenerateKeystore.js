/* @flow */
import { Link } from 'react-router-dom';
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Button,
  Typography,
} from '~/src/lib/components/shared/base';
import type { WalletContext } from '~/src/wallet/shared/WalletContext';

import * as routes from '~/src/wallet/shared/routes';

const styleSheet = createStyleSheet('GenerateKeystore', theme => ({
  link: {
    textDecoration: 'none',
  },
  buttonText: {
    color: theme.custom.colors.common.white,
  },
}));

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  styleManager: AppStyleManager,
  walletContext: WalletContext,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function GenerateKeystore({
  className,
  styleManager,
  walletContext,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <Link
      className={classes.link}
      to={routes.makePath(walletContext, routes.CREATE_KEYSTORE)}
    >
      <Button
        className={className}
        raised
        color="primary"
      >
        <Typography className={classes.buttonText} type="body1">
          CREATE KEYSTORE
        </Typography>
      </Button>
    </Link>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    walletContext: () => null,
  }),
  pure,
)(GenerateKeystore): Class<React.Component<void, ExternalProps, void>>);
