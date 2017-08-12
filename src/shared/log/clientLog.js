/* @flow */
import {
  type BaseLogEvent,
  type BaseLogEventWithoutContext,
  type BaseLogMeta,
} from '~/src/lib/log/shared';
import createClientLog, {
  type UAEvent,
  explodeError,
  makeUAEvent as makeBaseUAEvent,
} from '~/src/lib/log/shared/createClientLog';
import { transformMeta } from '~/src/lib/log/shared/common';

import {
  type LogEvent,
  type LogEventWithoutContext,
  type LogMessage,
  type LogMeta,
} from './index';

import {
  type BaseDataLayer,
  getBaseDataLayer,
} from './common';

const makeUAEvent = (
  event:
    LogEvent |
    LogEventWithoutContext |
    BaseLogEvent |
    BaseLogEventWithoutContext,
  meta?: LogMeta | BaseLogMeta,
): ?UAEvent => {
  switch (event) {
    case 'NEW_WALLET_FLOW_PASSWORD':
      return {
        category: 'NEW_WALLET',
        action: 'ENTER_PASSWORD',
      };
    case 'NEW_WALLET_FLOW_KEYSTORE':
      return {
        category: 'NEW_WALLET',
        action: 'SAVE_KEYSTORE',
      };
    case 'NEW_WALLET_FLOW_PRIVATE_KEY':
      return {
        category: 'NEW_WALLET',
        action: 'SAVE_PRIVATE_KEY',
      };
    case 'CREATE_KEYSTORE_FOR_EXISTING':
      return {
        category: 'CREATE_KEYSTORE',
        action: 'EXISTING',
      };
    case 'CREATE_KEYSTORE_FOR_NEW':
      return {
        category: 'CREATE_KEYSTORE',
        action: 'NEW',
      };
    case 'CREATE_PAPER_WALLET':
      return {
        category: 'CREATE_PAPER_WALLET',
        action: 'CREATE',
      };
    case 'OPEN_WALLET_KEYSTORE':
      return {
        category: 'OPEN_WALLET',
        action: 'KEYSTORE',
      };
    case 'OPEN_WALLET_PRIVATE_KEY':
      return {
        category: 'OPEN_WALLET',
        action: 'PRIVATE_KEY',
      };
    case 'UNLOCK_WALLET_KEYSTORE':
      return {
        category: 'UNLOCK_WALLET',
        action: 'KEYSTORE',
      };
    case 'SEND_TRANSACTION_START':
      return {
        category: 'SEND_TRANSACTION',
        action: 'START',
      };
    case 'SEND_TRANSACTION_CANCEL':
      return {
        category: 'SEND_TRANSACTION',
        action: 'CANCEL',
      };
    case 'SEND_TRANSACTION_CONFIRM':
      return {
        category: 'SEND_TRANSACTION',
        action: 'CONFIRM',
      };
    case 'SEND_TRANSACTION_COMPLETE':
      return {
        category: 'SEND_TRANSACTION',
        action: 'COMPLETE',
      };
    case 'CLAIM_ALL_GAS_START':
      return {
        category: 'CLAIM_ALL_GAS',
        action: 'START',
      };
    case 'CLAIM_ALL_GAS_SPEND_ALL_CONFIRMED':
      return {
        category: 'CLAIM_ALL_GAS',
        action: 'SPEND_ALL_CONFIRMED',
      };
    case 'CLAIM_ALL_GAS_SPEND_ALL_SKIP':
      return {
        category: 'CLAIM_ALL_GAS',
        action: 'SPEND_ALL_SKIP',
      };
    case 'CLAIM_ALL_GAS_CLAIM_GAS_CONFIRMED':
      return {
        category: 'CLAIM_ALL_GAS',
        action: 'CLAIM_GAS_CONFIRMED',
      };
    case 'CLAIM_ALL_GAS_CLAIM_GAS_SKIPPED':
      return {
        category: 'CLAIM_ALL_GAS',
        action: 'CLAIM_GAS_SKIPPED',
      };
    case 'SHOW_CLAIM_HELP_DIALOG':
      return {
        category: 'CLAIM_HELP_DIALOG',
        action: 'SHOW',
      };
    default:
      break;
  }

  return makeBaseUAEvent(event, (meta: any));
};

type DataLayer = {|
  ...BaseDataLayer,
  event:
    LogEvent |
    LogEventWithoutContext |
    BaseLogEvent |
    BaseLogEventWithoutContext,
  meta?: ?(BaseLogMeta | LogMeta),
  uaEvent?: ?UAEvent,
|};

function makeDataLayer(
  base: BaseDataLayer,
  message: LogMessage,
): DataLayer {
  const { event, meta } = message;
  return {
    originalRequestID: base.originalRequestID,
    event,
    meta: meta == null ? undefined : transformMeta(meta, explodeError),
    uaEvent: makeUAEvent(event, meta),
  };
}

export default createClientLog(
  getBaseDataLayer,
  makeDataLayer,
);
