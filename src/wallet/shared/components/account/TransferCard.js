/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';
import { graphql } from 'react-relay';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { TitleCard } from '~/src/lib/components/shared/layout';
import {
  Typography,
} from '~/src/lib/components/shared/base';
import type { Wallet } from '~/src/wallet/shared/wallet';

import { fragmentContainer } from '~/src/lib/graphql/shared/relay';

import {
  type TransferCard_address,
} from './__generated__/TransferCard_address.graphql';
import TransferView from './TransferView';

const styleSheet = createStyleSheet('TransferCard', theme => ({
  [theme.breakpoints.down('sm')]: {
    content: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    content: {
      padding: theme.spacing.unit * 2,
    },
  },
  content: {},
}));

type ExternalProps = {|
  wallet: ?Wallet,
  address?: any,
  loading?: boolean,
  error?: ?Error,
  retry?: ?() => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  address: TransferCard_address,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TransferCard({
  wallet,
  address,
  loading,
  error,
  retry,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let content = (
    <Typography type="body1">
      Open or create a wallet to send NEO/GAS.
    </Typography>
  );
  if (wallet != null) {
    if (wallet.isLocked) {
      content = (
        <Typography type="body1">
          Unlock your wallet to send NEO/GAS.
        </Typography>
      );
    } else {
      content = (
        <TransferView
          wallet={wallet}
          address={address}
          loading={loading}
          error={error}
          retry={retry}
        />
      );
    }
  }

  return (
    <TitleCard className={className} title="Transfer">
      <div className={classes.content}>
        {content}
      </div>
    </TitleCard>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  fragmentContainer({
    address: graphql`
      fragment TransferCard_address on Address {
        ...TransferView_address
      }
    `,
  }),
  pure,
)(TransferCard): Class<React.Component<void, ExternalProps, void>>);
