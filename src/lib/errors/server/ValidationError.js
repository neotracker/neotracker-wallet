/* @flow */
import CodedError from './CodedError';

export default class ValidationError extends CodedError {
  constructor(message: string, data?: Object) {
    super('VALIDATION_ERROR', message, { ...(data || {}), message });
  }
}
