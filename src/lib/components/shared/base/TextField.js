/* @flow */
import MUITextField from 'material-ui/TextField/TextField';
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
  withHandlers,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import Typography from './Typography';

import { createKeyDown, createKeyUp } from './keys';

const styleSheet = createStyleSheet('TextField', theme => ({
  root: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
  },
  subtextArea: {
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  wrapper: {
    marginBottom: 8,
    marginTop: 8,
  },
  error: {
    color: theme.palette.error[500],
  },
  characterCounter: {
    flex: '0 0 auto',
  },
  textField: {
    flex: '1 1 auto',
  },
  inputLabelRoot: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },
  subtext: {
    minHeight: 12,
  },
}));

// TODO: Fix jumpiness by requiring the consumer to pass hasSubtext and
//       rendering a spacer
export type ExternalProps = {|
  value: string,
  hasSubtext?: boolean,
  subtext?: ?string,
  error?: boolean,
  maxCharacters?: number,
  label?: string,
  required?: boolean,
  multiline?: boolean,
  rows?: number,
  rowsMax?: number,
  type?: string,
  disabled?: boolean,
  disableMargin?: boolean,
  readOnly?: boolean,
  onFocus?: (event: Object) => void,
  onBlur?: (event: Object) => void,
  onChange?: (event: Object) => void,
  onUpArrow?: (event: Object) => void,
  onDownArrow?: (event: Object) => void,
  onShiftUpArrow?: (event: Object) => void,
  onShiftDownArrow?: (event: Object) => void,
  onEscape?: (event: Object) => void,
  onEscapeUp?: (event: Object) => void,
  onEnter?: (event: Object) => void,
  onBackspace?: (event: Object) => void,
  onClick?: (event: Object) => void,
  setInputRef?: (ref: any) => void,
  inputClasses?: Object,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  onKeyDown: (event: Object) => void,
  onKeyUp: (event: Object) => void,
  styleManager: any,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function TextField({
  value,
  subtext,
  hasSubtext,
  error,
  maxCharacters,
  label,
  required,
  multiline,
  rows,
  rowsMax,
  type,
  disabled,
  disableMargin,
  readOnly,
  inputClasses,
  className,
  onFocus,
  onBlur,
  onChange,
  onKeyDown,
  onKeyUp,
  onClick,
  setInputRef,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const anyError = (
    error ||
    (maxCharacters != null && value.length > maxCharacters)
  );
  let subtextElement = null;
  if (hasSubtext) {
    subtextElement = (
      <Typography
        type="caption"
        className={classNames({ [classes.error]: anyError }, classes.subtext)}
      >
        {subtext || ''}
      </Typography>
    );
  }
  let characterCounter = null;
  if (maxCharacters != null) {
    characterCounter = (
      <Typography
        type="caption"
        className={classNames({
          [classes.error]: anyError,
          [classes.characterCounter]: true,
        })}
      >
        {value.length} / {maxCharacters}
      </Typography>
    );
    if (subtextElement == null) {
      subtextElement = <div />;
    }
  }

  let subtextArea = null;
  if (subtextElement != null || characterCounter != null) {
    subtextArea = (
      <div className={classes.subtextArea}>
        {subtextElement}
        {characterCounter}
      </div>
    );
  }

  return (
    <div className={classNames(className, classes.root)}>
      <MUITextField
        data-test="textField"
        className={classes.textField}
        error={anyError}
        value={value}
        label={label}
        required={!!required}
        multiline={!!multiline}
        rows={rows}
        rowsMax={rowsMax}
        type={type}
        disabled={disabled}
        InputProps={{
          onFocus,
          onBlur,
          onChange,
          className: disableMargin ? undefined : classes.wrapper,
          classes: inputClasses,
          inputRef: setInputRef,
        }}
        InputLabelProps={{
          classes: {
            root: classes.inputLabelRoot,
          },
        }}
        inputProps={{
          onKeyDown,
          onKeyUp,
          onClick,
          readOnly: readOnly ? 'readonly' : undefined,
        }}
      />
      {subtextArea}
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  withHandlers({
    onKeyDown: createKeyDown,
    onKeyUp: createKeyUp,
  }),
  pure,
)(TextField): Class<React.Component<void, ExternalProps, void>>);
