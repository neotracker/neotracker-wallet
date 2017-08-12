/* @flow */
import { Link as RRLink } from 'react-router-dom';
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
  withHandlers,
} from 'recompose';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import { graphql } from 'react-relay';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Button,
  Card,
  Collapse,
  Typography,
} from '~/src/lib/components/shared/base';
import {
  Link,
} from '~/src/lib/components/shared/link';
import {
  AccountView,
} from '~/src/wallet/shared/components/account';
import {
  Selector,
} from '~/src/lib/components/shared/selector';
import { Tooltip } from '~/src/lib/components/shared/tooltip';
import { type Wallet } from '~/src/wallet/shared/wallet';
import type { WalletContext } from '~/src/wallet/shared/WalletContext';

import * as routes from '~/src/wallet/shared/routes';
import {
  deleteWallet,
  selectWallet,
  selectWallets,
} from '~/src/wallet/shared/redux';
import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type SelectCard_address,
} from './__generated__/SelectCard_address.graphql';
import UnlockWallet from './UnlockWallet';

const styleSheet = createStyleSheet('SelectCard', theme => ({
  [theme.breakpoints.down('sm')]: {
    header: {
      paddingLeft: theme.spacing.unit,
      paddingTop: theme.spacing.unit,
    },
    content: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    header: {
      paddingLeft: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
    content: {
      padding: theme.spacing.unit * 2,
    },
  },
  content: {},
  header: {
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.lightDivider}`,
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  headerGroup: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  selectorArea: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 1 auto',
    marginBottom: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 0,
  },
  buttonArea: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  title: {
    marginRight: theme.spacing.unit / 2,
  },
  selector: {
    maxWidth: theme.spacing.unit * 50,
    minWidth: 0,
  },
  buttonText: {
    color: theme.custom.colors.common.white,
  },
  buttonMargin: {
    marginBottom: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  link: {
    display: 'block',
    textDecoration: 'none',
  },
}));

type ExternalProps = {|
  wallet: ?Wallet,
  address?: any,
  loading?: boolean,
  error?: ?Error,
  retry?: ?() => void,
  forward?: boolean,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  address: SelectCard_address,
  wallets: Array<Wallet>,
  onSelect: (wallet: Object) => void,
  onClickDeleteWallet: () => void,
  styleManager: AppStyleManager,
  walletContext: WalletContext,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function SelectCard({
  wallet,
  address,
  loading,
  error,
  retry,
  forward,
  className,
  wallets,
  onSelect,
  onClickDeleteWallet,
  styleManager,
  walletContext,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let selector;
  if (wallets.length > 0) {
    selector = (
      <div className={classes.selectorArea}>
        <Typography className={classes.title} type="title">
          Wallet
        </Typography>
        <Selector
          className={classes.selector}
          id="select-wallet"
          label="Select Wallet"
          options={wallets.map(walletOption => ({
            id: walletOption.address,
            text: walletOption.name,
            wallet: walletOption,
          }))}
          selectedID={
            wallet == null
              ? null
              : wallet.address
          }
          selectText="Select Wallet"
          onSelect={onSelect}
        />
      </div>
    );
  }

  const makeButton = ({
    path,
    onClick,
    text,
    tooltip,
  }: {
    // eslint-disable-next-line
    path?: string,
    // eslint-disable-next-line
    onClick?: () => void,
    text: string,
    tooltip: string,
  }) => {
    let button = (
      <Button
        className={classNames({
          [classes.buttonMargin]: path == null,
        })}
        raised
        color="primary"
        onClick={onClick}
      >
        <Typography
          className={classes.buttonText}
          type="body1"
        >
          {text}
        </Typography>
      </Button>
    );

    if (path != null) {
      button = (
        <RRLink
          className={classNames(
            classes.link,
            classes.buttonMargin,
          )}
          to={routes.makePath(walletContext, path)}
        >
          {button}
        </RRLink>
      );
    }

    return (
      <Tooltip
        title={tooltip}
        position="bottom"
      >
        {button}
      </Tooltip>
    );
  };

  let deleteButton;
  if (wallet != null) {
    deleteButton = makeButton({
      onClick: onClickDeleteWallet,
      text: 'DELETE WALLET',
      tooltip:
        'Delete the currently selected wallet from local storage. This does ' +
        'not delete the address or the funds at the address, it only ' +
        'removes it from storage local to your computer.',
    });
  }

  let content;
  if (wallet == null) {
    content = (
      <Typography className={classes.content} type="body1">
        Create a new wallet or open an existing one to view balance and claim GAS.
      </Typography>
    );
  } else if (wallet.isLocked) {
    content = <UnlockWallet wallet={wallet} forward={forward} />;
  } else {
    content = (
      <AccountView
        wallet={wallet}
        address={address}
        loading={loading}
        error={error}
        retry={retry}
        forward={forward}
      />
    );
  }

  return (
    <Card className={className}>
      <div className={classes.header}>
        <div className={classes.headerGroup}>
          {selector}
          <div className={classes.buttonArea}>
            {makeButton({
              path: routes.NEW_WALLET,
              text: 'NEW WALLET',
              tooltip:
                'Generate a new private key and address in order to interact ' +
                'with the blockchain to receive NEO or GAS, claim GAS and more.',
            })}
            {makeButton({
              path: routes.OPEN_WALLET,
              text: 'OPEN WALLET',
              tooltip:
                'Open a wallet to interact with the blockchain in order to send ' +
                'NEO or GAS, claim GAS and more.',
            })}
            {deleteButton}
          </div>
        </div>
        <Link
          className={classes.buttonMargin}
          path={routes.makePath(walletContext, routes.WALLET_FAQ)}
          title="FAQ"
          type="subheading"
          component="p"
        />
      </div>
      <Collapse
        in={content != null}
        transitionDuration="auto"
      >
        {content}
      </Collapse>
    </Card>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    walletContext: () => null,
  }),
  connect(
    (state, { walletContext }) => ({
      wallets: selectWallets(walletContext, state),
    }),
    dispatch => ({
      onSelect: (option: Object) => dispatch(selectWallet({
        wallet: option.wallet,
      })),
      onDelete: (wallet: Wallet) => dispatch(deleteWallet({ wallet })),
    }),
  ),
  withHandlers({
    onClickDeleteWallet: ({ onDelete, wallet }) => () => onDelete(wallet),
  }),
  fragmentContainer({
    address: graphql`
      fragment SelectCard_address on Address {
        ...AccountView_address
      }
    `
  }),
  pure,
)(SelectCard): Class<React.Component<void, ExternalProps, void>>);
