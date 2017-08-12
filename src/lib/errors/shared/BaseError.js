/* @flow */
export default class BaseError extends Error {
  data: ?Object;

  constructor(message: string, data?: Object) {
    super(message);
    this.data = data;
  }
}
