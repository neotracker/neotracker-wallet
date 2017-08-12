/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
  withHandlers,
} from 'recompose';

import TextField, {
  // eslint-disable-next-line
  type ExternalProps as TextFieldExternalProps,
} from '~/src/lib/components/shared/base/TextField';

import { clipboard } from '~/src/lib/utils/shared';
import log from '~/src/shared/log';

/* ::
type ExternalProps = {|
  ...TextFieldExternalProps,
  name: string,
  value: string,
|};
*/
// eslint-disable-next-line
type InternalProps = {|
  loggingContext: any,
  onClick: () => void,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function CopyField({
  onClick: onClickIn,
  loggingContext,
  name,
  ...props
}: Props): React.Element<*> {
  let onClick;
  if (clipboard.isSupported(loggingContext.userAgent)) {
    onClick = onClickIn;
  }
  return (
    <TextField
      {...props}
      onClick={onClick || props.onClick}
      readOnly
    />
  );
}

export default (compose(
  getContext({
    loggingContext: () => null,
    walletContext: () => null,
  }),
  pure,
  withHandlers({
    onClick: ({
      value,
      loggingContext,
      name,
      onClick,
      walletContext,
    }) => (event) => {
      clipboard.copy(value, loggingContext.userAgent)
        .then(() => {
          walletContext.setSnackbar({
            message: `${name} Copied`,
          });
        })
        .catch(error => {
          walletContext.showSnackbarError({ error });
          log({
            event: 'COPY_ERROR',
            meta: { type: 'error', error },
            context: loggingContext,
          });
        });
      if (onClick) {
        onClick(event);
      }
    },
  }),
)(CopyField): Class<React.Component<void, ExternalProps, void>>);
