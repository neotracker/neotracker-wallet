/* @flow */
import React from 'react';

import {
  compose,
  pure,
  withPropsOnChange,
} from 'recompose';

import type { UnlockedWallet } from '~/src/wallet/shared/wallet';

import * as walletAPI from '~/src/wallet/shared/wallet';

import GenerateKeystore from './GenerateKeystore';
import SaveKeystoreFile from './SaveKeystoreFile';

type ExternalProps = {|
  wallet: UnlockedWallet,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  filename: string,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function SaveOrGenerateKeystore({
  wallet,
  className,
  filename,
}: Props): React.Element<any> {
  if (wallet.keystore == null) {
    return <GenerateKeystore className={className} />;
  }

  return (
    <SaveKeystoreFile
      className={className}
      keystore={wallet.keystore}
      filename={filename}
    />
  )
}

export default (compose(
  withPropsOnChange(
    ['wallet'],
    ({ wallet }) => ({
      filename: walletAPI.createKeystoreFilename({ address: wallet.address }),
    }),
  ),
  pure,
)(SaveOrGenerateKeystore): Class<React.Component<void, ExternalProps, void>>);
