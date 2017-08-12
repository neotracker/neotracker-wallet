/* @flow */
import {
  type Log,
  type LogMessage as BaseLogMessage,
  type Profile,
  createProfile,
} from '~/src/lib/log/shared';
import { type UserAgent } from '~/src/lib/ua/shared';

export { getBaseDataLayer } from './common';

type LogMetaPlaceholder = {|
  type: 'placeholder',
|};
export type LogMeta =
  LogMetaPlaceholder;

export type LogEvent =
  'BLOCKCHAIN_SCRAPE' |
  'BLOCKCHAIN_MAIN_SCRAPE' |
  'BLOCKCHAIN_TEST_SCRAPE' |
  'BLOCKCHAIN_SCRAPE_ERROR' |
  'BLOCKCHAIN_SCRAPE_LOCK_ERROR' |
  'BLOCKCHAIN_BAD_SCRAPE_ERROR' |
  'BLOCKCHAIN_FIX_ERROR' |
  'UNEXPECTED_BLOCKCHAIN_SCRAPE_ERROR' |
  'DB_DESTROY_ERROR' |
  'CRYPTOCOMPARE_FETCH_ERROR' |
  'COINMARKETCAP_FETCH_ERROR' |
  'SAVE_NEW_UNCONFIRMED_TRANSACTION_ERROR' |
  'SAVE_NEW_UNCONFIRMED_TRANSACTIONS_ERROR' |
  'DELETE_OLD_UNCONFIRMED_TRANSACTIONS_ERROR' |
  'KEYSTORE_SAVE_FILE_ERROR' |
  'NEW_WALLET_FLOW_PASSWORD' |
  'NEW_WALLET_FLOW_KEYSTORE' |
  'NEW_WALLET_FLOW_PRIVATE_KEY' |
  'CREATE_KEYSTORE_ERROR' |
  'CREATE_KEYSTORE_FOR_NEW' |
  'CREATE_KEYSTORE_FOR_EXISTING' |
  'CREATE_PAPER_WALLET' |
  'CREATE_PAPER_WALLET_ERROR' |
  'OPEN_WALLET_PRIVATE_KEY' |
  'OPEN_WALLET_KEYSTORE' |
  'OPEN_WALLET_PRIVATE_KEY_ERROR' |
  'OPEN_WALLET_KEYSTORE_ERROR' |
  'OPEN_WALLET_KEYSTORE_UPLOAD_FILE_ERROR' |
  'UNLOCK_WALLET_KEYSTORE' |
  'UNLOCK_WALLET_KEYSTORE_ERROR' |
  'SEND_TRANSACTION_START' |
  'SEND_TRANSACTION_CANCEL' |
  'SEND_TRANSACTION_CONFIRM' |
  'SEND_TRANSACTION_COMPLETE' |
  'SEND_TRANSACTION_ERROR' |
  'CLAIM_ALL_GAS_START' |
  'CLAIM_ALL_GAS_SPEND_ALL_CONFIRMED' |
  'CLAIM_ALL_GAS_SPEND_ALL_SKIP' |
  'CLAIM_ALL_GAS_CLAIM_GAS_CONFIRMED' |
  'CLAIM_ALL_GAS_CLAIM_GAS_SKIPPED' |
  'CLAIM_ALL_GAS_START_ERROR' |
  'CLAIM_ALL_GAS_FETCH_UNSPENT_SENDING_ERROR' |
  'CLAIM_ALL_GAS_FETCH_UNSPENT_DONE_ERROR' |
  'CLAIM_ALL_GAS_SPEND_ALL_SENDING_ERROR' |
  'CLAIM_ALL_GAS_SPEND_ALL_CONFIRMING_ERROR' |
  'CLAIM_ALL_GAS_SPEND_ALL_CONFIRMED_ERROR' |
  'CLAIM_ALL_GAS_SPEND_ALL_SKIP_ERROR' |
  'CLAIM_ALL_GAS_FETCH_UNCLAIMED_SENDING_ERROR' |
  'CLAIM_ALL_GAS_FETCH_UNCLAIMED_DONE_ERROR' |
  'CLAIM_ALL_GAS_CLAIM_GAS_SENDING_ERROR' |
  'CLAIM_ALL_GAS_CLAIM_GAS_CONFIRMING_ERROR' |
  'CLAIM_ALL_GAS_CLAIM_GAS_CONFIRMED_ERROR' |
  'CLAIM_ALL_GAS_CLAIM_GAS_SKIP_ERROR' |
  'SHOW_CLAIM_HELP_DIALOG' |
  'COPY_ERROR' |
  'SEND_RAW_TRANSACTION_ERROR';
export type LogEventWithoutContext =
  'UNCAUGHT_SCRAPE_ERROR' |
  'SCRAPE_SIGINT' |
  'SCRAPE_SIGTERM' |
  'SCRAPE_LISTENING' |
  'SCRAPE_SHUTDOWN_SUCCESS' |
  'SCRAPE_SHUTDOWN_ERROR' |
  'SERVER_SIGINT' |
  'SERVER_SIGTERM' |
  'SERVER_SHUTDOWN_SUCCESS' |
  'SERVER_SHUTDOWN_ERROR' |
  'INVALID_RPC_ENDPOINT' |
  'BLACKLIST_ENDPOINT' |
  'CLEAR_BLACKLIST' |
  'CLEAR_BLACKLIST_ALL_INVALID';

export type ClientLoggingContext = {|
  type: 'client',
  originalRequestID: string,
  userAgent: UserAgent,
  isTestNet: boolean,
|};

export type ServerLoggingContext = {|
  type: 'server',
  request: {
    id: string,
    url: string,
    method: string,
    start: number,
  },
  userAgent: UserAgent,
  isTestNet: boolean,
|};

export type LoggingContext =
  ClientLoggingContext |
  ServerLoggingContext;

export type LogMessage = BaseLogMessage<
  LogEvent,
  LogEventWithoutContext,
  LogMeta,
  LoggingContext
>;

function getLog(
): Log<LogEvent, LogEventWithoutContext, LogMeta, LoggingContext> {
  if (process.env.BUILD_FLAG_IS_CLIENT) {
    return (require('./clientLog').default: any);
  // eslint-disable-next-line no-else-return
  } else {
    return (require('./serverLog').default: any);
  }
}

const log = getLog();

export default log;

export type Point =
  'placeholder' |
  'placeholder2';

export const profile = (createProfile(log): Profile<Point, LoggingContext>);
