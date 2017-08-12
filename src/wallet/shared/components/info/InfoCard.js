/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { TitleCard } from '~/src/lib/components/shared/layout';
import {
  Typography,
} from '~/src/lib/components/shared/base';
import type { Wallet } from '~/src/wallet/shared/wallet';

import InfoView from './InfoView';

const styleSheet = createStyleSheet('InfoCard', theme => ({
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
function InfoCard({
  wallet,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let content = (
    <Typography type="body1">
      Open or create a wallet to view wallet details.
    </Typography>
  );
  if (wallet != null) {
    if (wallet.isLocked) {
      content = (
        <Typography type="body1">
          Unlock your wallet to see wallet details.
        </Typography>
      );
    } else {
      content = <InfoView wallet={wallet} />;
    }
  }

  return (
    <TitleCard
      className={className}
      title="Details"
      titleComponent="h2"
    >
      <div className={classes.content}>
        {content}
      </div>
    </TitleCard>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(InfoCard): Class<React.Component<void, ExternalProps, void>>);
