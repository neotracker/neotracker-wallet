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
import {
  Icon,
  IconButton,
} from '~/src/lib/components/shared/base';
import TextField, {
  // eslint-disable-next-line
  type ExternalProps as TextFieldExternalProps,
} from '~/src/lib/components/shared/base/TextField';

import CopyField from './CopyField';

const styleSheet = createStyleSheet('PasswordField', (theme) => ({
  root: {
    display: 'flex',
  },
  visibleButtonSubtext: {
    marginTop: theme.spacing.unit,
  },
  visibleButtonLabelOnly: {
    marginTop: theme.spacing.unit / 2,
  },
}));

type ExternalProps = {|
  ...TextFieldExternalProps,
  value: string,
  copyOnClickName?: string,
  label?: string,
  validation?: string,
  hasSubtext?: boolean,
  onChange?: (event: Object) => void,
  onEnter?: () => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  visible: boolean,
  onHidePassword: () => void,
  onShowPassword: () => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function PasswordField({
  value,
  label,
  validation: validationIn,
  hasSubtext: hasSubtextIn,
  copyOnClickName,
  onEnter,
  onChange,
  className,
  visible,
  onHidePassword,
  onShowPassword,
  styleManager,
  ...other
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const type = visible ? 'text' : 'password';
  const validation = value === '' ? null : validationIn;
  const hasSubtext = !!hasSubtextIn;
  let field = (
    <TextField
      {...other}
      value={value}
      type={type}
      error={validation != null}
      subtext={validation}
      hasSubtext={hasSubtext}
      label={label}
      onChange={onChange}
      onEnter={onEnter}
    />
  );
  if (copyOnClickName != null && visible) {
    field = (
      <CopyField
        {...other}
        value={value}
        type={type}
        error={validation != null}
        subtext={validation}
        hasSubtext={hasSubtext}
        label={label}
        onChange={onChange}
        onEnter={onEnter}
        name={copyOnClickName}
      />
    );
  }
  return (
    <div className={classNames(className, classes.root)}>
      {field}
      <IconButton
        className={classNames({
          [classes.visibleButtonSubtext]: hasSubtext,
          [classes.visibleButtonLabelOnly]: !hasSubtext && label != null,
        })}
        onClick={visible ? onHidePassword : onShowPassword}
      >
        <Icon>{visible ? 'visibility_off' : 'visibility'}</Icon>
      </IconButton>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  withState('state', 'setState', () => ({
    visible: false,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onHidePassword: ({ setState }) => () => setState(prevState => ({
      ...prevState,
      visible: false,
    })),
    onShowPassword: ({ setState }) => () => setState(prevState => ({
      ...prevState,
      visible: true,
    })),
  }),
  pure,
)(PasswordField): Class<React.Component<void, ExternalProps, void>>);
