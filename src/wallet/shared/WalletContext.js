/* @flow */
import React from 'react';

export type WalletContext = {|
  rootPath: string,
  selectWallet: (state: Object) => Object,
  setSnackbar: ({|
    message: string | React.Element<any>,
    timeoutMS?: number,
  |}) => void,
  showSnackbarError: ({|
    error: Error,
  |}) => void,
  rpcEndpoint: string,
|};
