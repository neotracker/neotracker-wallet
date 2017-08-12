/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { CopyField } from '~/src/wallet/shared/components/common';
import { type Keystore } from '~/src/wallet/shared/wallet';
import { Typography } from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('SaveKeystoreFileText', theme => ({
}));

type ExternalProps = {|
  keystore: Keystore,
  onSave?: () => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function SaveKeystoreFileText({
  keystore,
  onSave,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={className}>
      <Typography type="body1">
        Save Keystore:
      </Typography>
      <CopyField
        value={JSON.stringify(keystore)}
        name="Keystore"
        onClick={onSave}
      />
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(SaveKeystoreFileText): Class<React.Component<void, ExternalProps, void>>);
