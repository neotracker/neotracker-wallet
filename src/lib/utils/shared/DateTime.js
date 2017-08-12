/* @flow */

export default class DateTime {
  static nowInSeconds(): number {
    return Math.round(Date.now() / 1000);
  }
}
