/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Collapse,
} from '~/src/lib/components/shared/base';
import type { ClaimAllGASProgress, Wallet } from '~/src/wallet/shared/wallet';

import {
  selectClaimProgress,
  selectClaimError,
  selectClaimSpendConfirmHash,
  selectClaimClaimConfirmHash,
} from '~/src/wallet/shared/redux';

import ClaimGASStep from './ClaimGASStep';

const styleSheet = createStyleSheet('ClaimGASSteps', theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  padding: {
    paddingBottom: theme.spacing.unit / 2,
  },
}));

type ExternalProps = {|
  wallet: ?Wallet,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  progress: ?ClaimAllGASProgress,
  error: ?string,
  spendConfirmTransactionHash?: string,
  claimConfirmTransactionHash?: string,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function ClaimGASSteps({
  className,
  progress,
  error,
  spendConfirmTransactionHash,
  claimConfirmTransactionHash,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);

  let spendInProgress = false;
  let spendError = null;
  let spendConfirmInProgress = false;
  let spendConfirmError = null;
  let claimInProgress = false;
  let claimError = null;
  let claimConfirmInProgress = false;
  let claimConfirmError = null;
  if (progress != null) {
    switch (progress.type) {
      case 'fetch-unspent-sending':
      case 'fetch-unspent-done':
      case 'spend-all-sending':
        if (error == null) {
          spendInProgress = true;
        } else {
          spendError = error;
        }
        break;
      case 'spend-all-confirming':
        if (error == null) {
          spendConfirmInProgress = true;
        } else {
          spendConfirmError = error;
        }
        break;
      case 'spend-all-confirmed':
      case 'spend-all-skip':
      case 'fetch-unclaimed-sending':
      case 'fetch-unclaimed-done':
      case 'claim-gas-sending':
        if (error == null) {
          claimInProgress = true;
        } else {
          claimError = error;
        }
        break;
      case 'claim-gas-confirming':
        if (error == null) {
          claimConfirmInProgress = true;
        } else {
          claimConfirmError = error;
        }
        break;
      case 'claim-gas-confirmed':
      case 'claim-gas-skip':
        if (error != null) {
          claimConfirmError = error;
        }
        break;
      default:
        break;
    }
  }

  const spendDone = !spendInProgress && spendError == null
  const spendConfirmDone = (
    spendDone &&
    !spendConfirmInProgress &&
    spendConfirmError == null
  );
  const claimDone = (
    spendDone &&
    spendConfirmDone &&
    !claimInProgress &&
    claimError == null
  );
  const claimConfirmDone = (
    spendDone &&
    spendConfirmDone &&
    claimDone &&
    !claimConfirmInProgress &&
    claimConfirmError == null
  );
  return (
    <Collapse
      in={progress != null}
      transitionDuration="auto"
    >
      <div className={classNames(className, classes.root)}>
        <ClaimGASStep
          className={classes.padding}
          stepDescription="1. Send NEO to wallet address."
          tooltip={
            'In order to claim GAS we must "spend" it, so we create a ' +
            'transaction that sends all NEO back to the wallet address.'
          }
          done={spendDone}
          inProgress={spendInProgress}
          error={spendError}
        />
        <ClaimGASStep
          className={classes.padding}
          stepDescription="2. Wait for confirmation of transfer."
          tooltip={
            'Wait for the transfer transaction that will "spend" all NEO to be ' +
            'confirmed. Confirming a transaction can take up to a minute to process.'
          }
          done={spendConfirmDone}
          inProgress={spendConfirmInProgress}
          error={spendConfirmError}
          transactionHash={spendConfirmTransactionHash}
        />
        <ClaimGASStep
          className={classes.padding}
          stepDescription="3. Claim GAS."
          tooltip={
            'Claim all GAS for "spent" transactions including the ones we ' +
            '"spent" in the previous steps. '
          }
          done={claimDone}
          inProgress={claimInProgress}
          error={claimError}
        />
        <ClaimGASStep
          stepDescription="4. Wait for confirmation of claim."
          tooltip={
            'Wait for the GAS claim transaction for the ' +
            '"spent" NEO transactions to be confirmed. Confirming a ' +
            'transaction can take up to a minute to process.'
          }
          done={claimConfirmDone}
          inProgress={claimConfirmInProgress}
          error={claimConfirmError}
          transactionHash={claimConfirmTransactionHash}
        />
      </div>
    </Collapse>
  );
}

export default (compose(
  getContext({ styleManager: () => null, walletContext: () => null }),
  connect(
    (state, { wallet, walletContext }) => ({
      progress: selectClaimProgress(walletContext, state)[wallet.address],
      error: selectClaimError(walletContext, state)[wallet.address],
      spendConfirmTransactionHash:
        selectClaimSpendConfirmHash(walletContext, state)[wallet.address],
      claimConfirmTransactionHash:
        selectClaimClaimConfirmHash(walletContext, state)[wallet.address],
    }),
  ),
  pure,
)(ClaimGASSteps): Class<React.Component<void, ExternalProps, void>>);
