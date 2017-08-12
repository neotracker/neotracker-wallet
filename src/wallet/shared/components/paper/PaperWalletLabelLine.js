/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Typography,
} from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('PaperWalletLabelLine', () => ({
  borderBox: {
    boxSizing: 'border-box',
  },
}));

type ExternalProps = {|
  label: string,
  value: string,
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
function PaperWalletLabelLine({
  label,
  value,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <Typography
      className={classNames(className, classes.borderBox)}
      type="body1"
      component="p"
    >
      <span className={classes.borderBox}>{label}</span>
      <br className={classes.borderBox}/>
      <span className={classes.borderBox}>{value}</span>
    </Typography>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(PaperWalletLabelLine): Class<React.Component<void, ExternalProps, void>>);
