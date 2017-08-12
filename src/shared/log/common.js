/* @flow */
import { type ClientLoggingContext } from './index';

export type BaseDataLayer = {|
  originalRequestID?: string,
|};

// eslint-disable-next-line
export const getBaseDataLayer = (
  loggingContext: ClientLoggingContext,
): BaseDataLayer => ({
  originalRequestID: loggingContext.originalRequestID,
});
