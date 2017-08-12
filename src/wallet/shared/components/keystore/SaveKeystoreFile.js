/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { type Keystore } from '~/src/wallet/shared/wallet';

import SaveKeystoreFileBlob from './SaveKeystoreFileBlob';
import SaveKeystoreFileText from './SaveKeystoreFileText';

const styleSheet = createStyleSheet('SaveKeystoreFile', () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}));


let isFileSaverSupported;
try {
  isFileSaverSupported = !!new Blob;
} catch (e) {
  // eslint-disable-next-line
}

type ExternalProps = {|
  keystore: Keystore,
  filename: string,
  onSave?: () => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  error: boolean,
  onError: () => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function SaveKeystoreFile({
  keystore,
  filename,
  onSave,
  className,
  onError,
  error,
  styleManager,
}: Props): React.Element<any> {
  const classes = styleManager.render(styleSheet);
  if (isFileSaverSupported) {
    if (error) {
      return (
        <div className={classNames(className, classes.root)}>
          <SaveKeystoreFileBlob
            keystore={keystore}
            filename={filename}
            onSave={onSave}
            onError={onError}
          />
          <SaveKeystoreFileText
            keystore={keystore}
            onSave={onSave}
          />
        </div>
      )
    }
    return (
      <SaveKeystoreFileBlob
        className={className}
        keystore={keystore}
        filename={filename}
        onSave={onSave}
        onError={onError}
      />
    );
  }

  return (
    <SaveKeystoreFileText
      className={className}
      keystore={keystore}
      onSave={onSave}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
  withState('state', 'setState', () => ({
    error: false,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onError: ({ setState }) => () => setState(prevState => ({
      ...prevState,
      error: true,
    })),
  }),
)(SaveKeystoreFile): Class<React.Component<void, ExternalProps, void>>);
