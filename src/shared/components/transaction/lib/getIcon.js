/* @flow */
import {
  type TransactionType,
} from '~/src/lib/blockchain/shared/constants';

export default (type: TransactionType) => {
  let icon;
  switch (type) {
    case 'MinerTransaction':
      icon = 'build';
      break;
    case 'IssueTransaction':
      icon = 'account_balance';
      break;
    case 'ClaimTransaction':
      icon = 'redeem';
      break;
    case 'EnrollmentTransaction':
      icon = 'supervisor_account';
      break;
    case 'RegisterTransaction':
      icon = 'assignment';
      break;
    case 'ContractTransaction':
      icon = 'payment';
      break;
    case 'PublishTransaction':
      icon = 'description';
      break;
    case 'InvocationTransaction':
      icon = 'play_arrow';
      break;
    default:
      // eslint-disable-next-line
      (type: empty);
      break;
  }

  return icon;
};
