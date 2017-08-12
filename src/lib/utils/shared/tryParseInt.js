/* @flow */
import {
  SOMETHING_WENT_WRONG,
  ClientError,
} from '~/src/lib/errors/shared';

const DEFAULT = Object.create(null);

export default ({
  value,
  // $FlowFixMe
  default: defaultValue = DEFAULT,
}: {|
  value: string,
  default?: ?number | typeof DEFAULT,
|}) => {
  const result = Number(value);
  if (Number.isNaN(result)) {
    if (defaultValue === DEFAULT) {
      throw new ClientError(
        SOMETHING_WENT_WRONG,
        { message: 'Not a number', value },
      );
    } else {
      return defaultValue;
    }
  }
  return result;
};
