/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';
import { graphql } from 'react-relay';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  CoinTable,
  CoinValue,
} from '~/src/shared/components/address/lib';
import {
  Link,
} from '~/src/lib/components/shared/link';
import {
  Typography,
} from '~/src/lib/components/shared/base';
import type { UnlockedWallet } from '~/src/wallet/shared/wallet';
import type { WalletContext } from '~/src/wallet/shared/WalletContext';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';
import * as routes from '~/src/wallet/shared/routes';

import {
  type AccountViewBase_address,
} from './__generated__/AccountViewBase_address.graphql';

import ClaimGASButton from './ClaimGASButton';
import ClaimGASSteps from './ClaimGASSteps';

const styleSheet = createStyleSheet('AccountViewBase', theme => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      paddingBottom: theme.spacing.unit,
      paddingTop: theme.spacing.unit,
    },
    padding: {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
    },
    margin: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    marginLeft: {
      marginLeft: theme.spacing.unit,
    },
    marginTop: {
      marginTop: theme.spacing.unit,
    },
    table: {
      paddingBottom: theme.spacing.unit,
    },
    steps: {
      paddingTop: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      paddingBottom: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2,
    },
    padding: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
    margin: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2,
    },
    marginLeft: {
      marginLeft: theme.spacing.unit * 2,
    },
    marginTop: {
      marginTop: theme.spacing.unit * 2,
    },
    table: {
      paddingBottom: theme.spacing.unit * 2,
    },
    steps: {
      paddingTop: theme.spacing.unit * 2,
    },
  },
  root: {},
  padding: {},
  margin: {},
  marginLeft: {},
  marginTop: {},
  table: {},
  steps: {},
  textColor: {
    color: theme.typography.body1.color,
  },
  unclaimed: {
    display: 'flex',
  },
  borderTop: {
    borderTop: `1px solid ${theme.palette.text.lightDivider}`,
  },
  claimArea: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  availableClaim: {
    marginRight: theme.spacing.unit / 2,
  },
  bottomElement: {
    paddingTop: theme.spacing.unit,
  },
  transferText: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  linkText: {
    display: 'inline',
  },
}));

type ExternalProps = {|
  wallet: UnlockedWallet,
  address: any,
  forward?: boolean,
  onClaimConfirmed?: ?() => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  address: ?AccountViewBase_address,
  walletContext: WalletContext,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function AccountViewBase({
  wallet,
  address,
  forward,
  onClaimConfirmed,
  className,
  walletContext,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let confirmedCoins = [];
  let claimValueAvailable = '0';
  if (address != null) {
    confirmedCoins = address.confirmed_coins.edges.map(
      edge => edge.node,
    );
    claimValueAvailable = address.claim_value_available_coin.value;
  }

  let forwardElement;
  if (forward) {
    forwardElement = (
      <div className={classNames(classes.marginTop, classes.borderTop)}>
        <Typography
          className={classNames(classes.marginLeft, classes.marginTop)}
          type="body1"
        >
          {'Send NEO/GAS, view wallet details and more on the '}
          <Link
            className={classes.linkText}
            path={routes.makePath(walletContext, routes.HOME)}
            title="main Wallet page."
            component="span"
          />
        </Typography>
      </div>
    );
  }

  return (
    <div className={classNames(className, classes.root)}>
      <CoinTable
        className={classNames(classes.table, classes.margin)}
        coins={confirmedCoins}
        type="display1"
        component="p"
        textClassName={classes.textColor}
      />
      <div className={classNames(classes.claimArea, classes.borderTop)}>
        <Typography
          className={classNames(
            classes.availableClaim,
            classes.marginLeft,
            classes.marginTop,
          )}
          type="subheading"
          component="p"
        >
          GAS available to claim:
        </Typography>
        <CoinValue
          className={classNames(classes.marginTop)}
          type="subheading"
          component="p"
          value={claimValueAvailable}
        />
        <ClaimGASButton
          className={classNames(
            classes.marginLeft,
            classes.marginTop,
          )}
          wallet={wallet}
          onClaimConfirmed={onClaimConfirmed}
        />
      </div>
      <ClaimGASSteps
        className={classNames(classes.steps, classes.margin)}
        wallet={wallet}
      />
      {forwardElement}
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null, walletContext: () => null }),
  fragmentContainer({
    address: graphql`
      fragment AccountViewBase_address on Address {
        confirmed_coins {
          edges {
            node {
              ...CoinTable_coins
            }
          }
        }
        claim_value_available_coin {
          value
        }
      }
    `,
  }),
  pure,
)(AccountViewBase): Class<React.Component<void, ExternalProps, void>>);
