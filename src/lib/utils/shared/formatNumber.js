/* @flow */
import BigNumber from 'bignumber.js';

type Options = {|
  decimalPlaces?: number,
|};
export default (
  number: number | string,
  optionsIn?: Options,
): string => {
  const options = optionsIn || {};
  const value = new BigNumber(number);
  const decimalPlaces = options.decimalPlaces == null
    ? value.decimalPlaces()
    : options.decimalPlaces;
  return value.toFormat(decimalPlaces);
}
