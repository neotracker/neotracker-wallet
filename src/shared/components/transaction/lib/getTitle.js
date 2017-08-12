/* @flow */
import {
  type TransactionType,
} from '~/src/lib/blockchain/shared/constants';

const TRANSACTION_LENGTH = 'Transaction'.length;

export default (type: TransactionType) => type.substring(
  0,
  type.length - TRANSACTION_LENGTH,
);
