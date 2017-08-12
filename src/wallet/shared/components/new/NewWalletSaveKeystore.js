/* @flow */
import React from 'react';

import {
  compose,
  pure,
  withHandlers,
  withProps,
  withState,
} from 'recompose';

import { type Keystore } from '~/src/wallet/shared/wallet';
import { SaveKeystoreFile } from '~/src/wallet/shared/components/keystore';

import NewWalletSaveCommon from './NewWalletSaveCommon';

type ExternalProps = {|
  keystore: Keystore,
  filename: string,
  onContinue: () => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  keystoreSaved: boolean,
  onSave: () => void,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function NewWalletSaveKeystore({
  keystore,
  filename,
  onContinue,
  className,
  keystoreSaved,
  onSave,
}: Props): React.Element<*> {
  return (
    <NewWalletSaveCommon
      className={className}
      title="Save Your Keystore File"
      saveElement={
        <SaveKeystoreFile
          keystore={keystore}
          filename={filename}
          onSave={onSave}
        />
      }
      saved={keystoreSaved}
      onContinue={onContinue}
    />
  );
}

export default (compose(
  pure,
  withState('state', 'setState', () => ({
    keystoreSaved: false,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onSave: ({ setState }) => () => setState(prevState => ({
      ...prevState,
      keystoreSaved: true,
    })),
  }),
)(NewWalletSaveKeystore): Class<React.Component<void, ExternalProps, void>>);
