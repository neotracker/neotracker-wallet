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
import { Typography } from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('PaperWalletLabeled', theme => ({
  root: {
    display: 'flex',
  },
  label: {
    color: theme.palette.primary[500],
    display: 'flex',
    justifyContent: 'center',
    paddingRight: theme.spacing.unit,
    transform: 'rotate(-180deg)',
    writingMode: 'vertical-rl',
  },
  borderBox: {
    boxSizing: 'border-box',
  },
}));

type ExternalProps = {|
  element: React.Element<any>,
  label: string,
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
function PaperWalletLabeled({
  element,
  label,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div
      className={classNames(classes.root, classes.borderBox, className)}
    >
      {element}
      <Typography
        className={classNames(classes.label, classes.borderBox)}
        type="body1"
        component="p"
      >
        {label}
      </Typography>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(PaperWalletLabeled): Class<React.Component<void, ExternalProps, void>>);
