/* @flow */
import ClientError, {
  SOMETHING_WENT_WRONG,
} from '../shared/ClientError';

const ERROR_CODES = {
  GRAPHQL_QUERY_NOT_FOUND_ERROR: SOMETHING_WENT_WRONG,
  INVALID_CSRF_TOKEN: SOMETHING_WENT_WRONG,
  NOT_FOUND_ERROR: SOMETHING_WENT_WRONG,
  PROGRAMMING_ERROR: SOMETHING_WENT_WRONG,
};

export default class CodedError extends ClientError {
  static GRAPHQL_QUERY_NOT_FOUND_ERROR = 'GRAPHQL_QUERY_NOT_FOUND_ERROR';
  static INVALID_CSRF_TOKEN = 'INVALID_CSRF_TOKEN';
  static NOT_FOUND_ERROR = 'NOT_FOUND_ERROR';
  static PROGRAMMING_ERROR = 'PROGRAMMING_ERROR';

  static ERROR_CODES = ERROR_CODES;

  constructor(errorCode: string, message: string, data?: Object) {
    super(
      message,
      { ...(data || {}), errorCode },
    );
  }
}
