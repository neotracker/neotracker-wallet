/* @flow */

// $FlowFixMe
export default function entries<TValue>(
  obj: {[key: string]: TValue},
): Array<TValue> {
  return Object.values(obj);
}
