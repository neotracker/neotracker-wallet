/* @flow */
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

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Button,
  Typography,
} from '~/src/lib/components/shared/base';
import type { UnlockedWallet } from '~/src/wallet/shared/wallet';

import log from '~/src/shared/log';
import {
  selectClaiming,
  endClaiming,
  startClaiming,
  claimError,
  claimProgress,
} from '~/src/wallet/shared/redux';
import * as walletAPI from '~/src/wallet/shared/wallet';

const styleSheet = createStyleSheet('ClaimGASButton', theme => ({
  root: {
    alignItems: 'center',
    display: 'flex',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  buttonText: {
    color: theme.custom.colors.common.white,
  },
}));

type ExternalProps = {|
  wallet: UnlockedWallet,
  onClaimConfirmed?: ?() => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  claiming: boolean,
  onClaimGas: () => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function ClaimGASButton({
  className,
  claiming,
  onClaimGas,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={classNames(className, classes.root)}>
      <Button
        className={classes.button}
        disabled={claiming}
        onClick={onClaimGas}
        raised
        color="primary"
      >
        <Typography className={classes.buttonText} type="body1">
          CLAIM GAS
        </Typography>
      </Button>
    </div>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    relayEnvironment: () => null,
    loggingContext: () => null,
    walletContext: () => null,
  }),
  connect(
    (state, { wallet, walletContext }) => ({
      claiming: selectClaiming(walletContext, state)[wallet.address],
    }),
    dispatch => ({ dispatch }),
  ),
  withHandlers({
    onClaimGas: ({
      relayEnvironment,
      wallet,
      loggingContext,
      dispatch,
      onClaimConfirmed,
      walletContext,
    }) => () => {
      let currentProgress;
      dispatch(startClaiming({ address: wallet.address }));
      log({
        event: 'CLAIM_ALL_GAS_START',
        context: loggingContext,
      });
      walletAPI.claimAllGAS({
        walletContext,
        environment: relayEnvironment,
        privateKey: wallet.privateKey,
        onProgress: (progress) => {
          dispatch(claimProgress({ address: wallet.address, progress }));
          currentProgress = progress;
          switch (progress.type) {
            case 'fetch-unspent-sending':
              break;
            case 'fetch-unspent-done':
              break;
            case 'spend-all-sending':
              break;
            case 'spend-all-confirming':
              break;
            case 'spend-all-confirmed':
              log({
                event: 'CLAIM_ALL_GAS_SPEND_ALL_CONFIRMED',
                context: loggingContext,
              });
              break;
            case 'spend-all-skip':
              log({
                event: 'CLAIM_ALL_GAS_SPEND_ALL_SKIP',
                context: loggingContext,
              });
              break;
            case 'fetch-unclaimed-sending':
              break;
            case 'fetch-unclaimed-done':
              break;
            case 'claim-gas-sending':
              break;
            case 'claim-gas-confirming':
              break;
            case 'claim-gas-confirmed':
              log({
                event: 'CLAIM_ALL_GAS_CLAIM_GAS_CONFIRMED',
                context: loggingContext,
              });
              if (onClaimConfirmed) {
                onClaimConfirmed();
              }
              break;
            case 'claim-gas-skip':
              log({
                event: 'CLAIM_ALL_GAS_CLAIM_GAS_SKIPPED',
                context: loggingContext,
              });
              break;
            default:
              // eslint-disable-next-line
              (progress.type: empty);
              break;
          }
        },
      }).then(() => {
        dispatch(endClaiming({ address: wallet.address }));
      }).catch((error) => {
        dispatch(endClaiming({ address: wallet.address }));
        dispatch(claimError({
          address: wallet.address,
          error:
            'Something went wrong. Please try again or ' +
            'refresh the page.',
        }));
        if (currentProgress == null) {
          log({
            event: 'CLAIM_ALL_GAS_START_ERROR',
            meta: { type: 'error', error },
            context: loggingContext,
          });
          return;
        }

        switch (currentProgress.type) {
          case 'fetch-unspent-sending':
            log({
              event: 'CLAIM_ALL_GAS_FETCH_UNSPENT_SENDING_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'fetch-unspent-done':
            log({
              event: 'CLAIM_ALL_GAS_FETCH_UNSPENT_DONE_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'spend-all-sending':
            log({
              event: 'CLAIM_ALL_GAS_SPEND_ALL_SENDING_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'spend-all-confirming':
            log({
              event: 'CLAIM_ALL_GAS_SPEND_ALL_CONFIRMING_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'spend-all-confirmed':
            log({
              event: 'CLAIM_ALL_GAS_SPEND_ALL_CONFIRMED_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'spend-all-skip':
            log({
              event: 'CLAIM_ALL_GAS_SPEND_ALL_SKIP_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'fetch-unclaimed-sending':
            log({
              event: 'CLAIM_ALL_GAS_FETCH_UNCLAIMED_SENDING_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'fetch-unclaimed-done':
            log({
              event: 'CLAIM_ALL_GAS_FETCH_UNCLAIMED_DONE_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'claim-gas-sending':
            log({
              event: 'CLAIM_ALL_GAS_CLAIM_GAS_SENDING_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'claim-gas-confirming':
            log({
              event: 'CLAIM_ALL_GAS_CLAIM_GAS_CONFIRMING_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'claim-gas-confirmed':
            log({
              event: 'CLAIM_ALL_GAS_CLAIM_GAS_CONFIRMED_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          case 'claim-gas-skip':
            log({
              event: 'CLAIM_ALL_GAS_CLAIM_GAS_SKIP_ERROR',
              meta: { type: 'error', error },
              context: loggingContext,
            });
            break;
          default:
            // eslint-disable-next-line
            (currentProgress.type: empty);
            break;
        }
      });
    },
  }),
  pure,
)(ClaimGASButton): Class<React.Component<void, ExternalProps, void>>);
