/* @flow */
export type AppContext = {|
  css: Array<string>,
  nonce: ?string,
  feature: {|
    wallet: {|
      enabled: boolean,
    |},
  |},
  routes: {
    makePublic: (path: string) => string,
  },
|};
