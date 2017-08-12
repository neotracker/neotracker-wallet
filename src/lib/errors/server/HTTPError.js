/* @flow */
import CodedError from './CodedError';

type StatusCode =
  400 |
  403 |
  500;
export default class HTTPError extends CodedError {
  expose: boolean;
  status: number;
  statusCode: number;

  constructor(
    statusCode: StatusCode,
    errorCode: string,
    message: string,
    data?: Object,
  ) {
    super(errorCode, message, { ...(data || {}), statusCode });
    this.expose = true;
    this.status = statusCode;
    this.statusCode = statusCode;
  }
}
