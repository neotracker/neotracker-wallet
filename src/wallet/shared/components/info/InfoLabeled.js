/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Help,
} from '~/src/lib/components/shared/help';
import {
  Typography,
} from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('InfoLabeled', theme => ({
  labelArea: {
    alignItems: 'center',
    display: 'flex',
  },
  label: {
    marginLeft: theme.spacing.unit,
  },
  element: {
    marginLeft: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit,
  },
}));

type ExternalProps = {|
  label: string,
  tooltip: string,
  element: React.Element<any>,
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
function InfoLabeled({
  label,
  tooltip,
  element,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={className}>
      <div className={classes.labelArea}>
        <Help tooltip={tooltip} />
        <Typography className={classes.label} type="body2">
          {label}
        </Typography>
      </div>
      <div className={classes.element}>
        {element}
      </div>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(InfoLabeled): Class<React.Component<void, ExternalProps, void>>);
