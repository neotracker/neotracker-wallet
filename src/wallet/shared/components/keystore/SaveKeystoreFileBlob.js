/* @flow */
import FileSaver from 'file-saver';
import React from 'react';

import {
  compose,
  getContext,
  pure,
  withHandlers,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Button,
  Typography,
} from '~/src/lib/components/shared/base';
import { ClientError } from '~/src/lib/errors/shared';
import { type Keystore } from '~/src/wallet/shared/wallet';

import log from '~/src/shared/log';

const styleSheet = createStyleSheet('SaveKeystoreFileBlob', theme => ({
  buttonText: {
    color: theme.custom.colors.common.white,
  },
}));

type ExternalProps = {|
  keystore: Keystore,
  filename: string,
  onError: () => void,
  onSave?: () => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  onClickSave: (event: Object) => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function SaveKeystoreFileBlob({
  className,
  onClickSave,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <Button
      className={className}
      onClick={onClickSave}
      raised
      color="primary"
    >
      <Typography className={classes.buttonText} type="body1">
        DOWNLOAD KEYSTORE
      </Typography>
    </Button>
  );
}

export default (compose(
  getContext({
    styleManager: () => null,
    loggingContext: () => null,
    walletContext: () => null,
  }),
  withHandlers({
    onClickSave: ({
      keystore,
      filename,
      onSave,
      loggingContext,
      walletContext,
      onError,
    }) => (event) => {
      try {
        const blob = new Blob(
          [JSON.stringify(keystore)],
          { type: "text/plain;charset=utf-8" },
        );
        FileSaver.saveAs(blob, filename);
      } catch (error) {
        log({
          event: 'KEYSTORE_SAVE_FILE_ERROR',
          meta: { type: 'error', error },
          context: loggingContext,
        });
        walletContext.showSnackbarError({
          error: new ClientError(
            'Something went wrong saving the Keystore file. Try again or try ' +
            'copying the Keystore string to a file on your computer.',
          ),
        });
        onError();
      }
      if (onSave != null) {
        onSave(event);
      }
    },
  }),
  pure,
)(SaveKeystoreFileBlob): Class<React.Component<void, ExternalProps, void>>);
