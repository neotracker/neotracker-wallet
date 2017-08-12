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
  CircularProgress,
  Icon,
  Typography,
} from '~/src/lib/components/shared/base';
import { Tooltip } from '~/src/lib/components/shared/tooltip';
import {
  TransactionLink,
} from '~/src/shared/components/transaction/lib';
import {
  Help,
} from '~/src/lib/components/shared/help';

const styleSheet = createStyleSheet('ClaimGASStep', theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    alignItems: 'center',
    display: 'flex',
  },
  hash: {
    marginLeft: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit / 2,
  },
  done: {
    color: theme.palette.primary[700],
  },
  inProgress: {
    color: theme.palette.primary[500],
  },
  tooltip: {
    cursor: 'pointer',
  },
  failed: {
    color: theme.palette.error[500],
  },
  margin: {
    marginRight: theme.spacing.unit,
  },
}));

type ExternalProps = {|
  stepDescription: string,
  tooltip: string,
  done: boolean,
  inProgress: boolean,
  error: ?string,
  transactionHash?: string,
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
function ClaimGASStep({
  stepDescription,
  tooltip,
  done,
  inProgress,
  error,
  transactionHash,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let errorElement;
  if (error != null) {
    errorElement = (
      <Tooltip
        className={classNames(classes.tooltip, classes.margin)}
        title={error}
        position="bottom"
      >
        <Icon className={classes.failed}>warning</Icon>
      </Tooltip>
    );
  }

  let hashElement;
  if (transactionHash != null) {
    hashElement = (
      <TransactionLink
        className={classes.hash}
        transactionHash={transactionHash}
      />
    );
  }

  let checkElement;
  if (done) {
    checkElement = (
      <Icon
        className={classNames(classes.done, classes.margin)}
      >
        check_circle
      </Icon>
    );
  }

  let loadingElement;
  if (inProgress) {
    loadingElement = <CircularProgress className={classes.margin} size={24} />;
  }

  const color = classNames({
    [classes.done]: done,
    [classes.inProgress]: inProgress,
    [classes.failed]: error != null,
  });
  return (
    <div className={classNames(className, classes.root)}>
      <div className={classes.main}>
        <Typography
          className={classNames(color, classes.margin)}
          type="body1"
        >
          {stepDescription}
        </Typography>
        {checkElement}
        {errorElement}
        {loadingElement}
        <Help className={color} tooltip={tooltip} />
      </div>
      {hashElement}
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(ClaimGASStep): Class<React.Component<void, ExternalProps, void>>);
