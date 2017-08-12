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
  Button,
  Typography,
} from '~/src/lib/components/shared/base';
import { Logo } from '~/src/shared/components/common/logo';

const styleSheet = createStyleSheet('ErrorView', theme => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      padding: theme.spacing.unit * 2,
    },
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardContainer: {
    maxWidth: 456,
  },
  headline: {
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
  },
  retryArea: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  reloadButton: {
    marginTop: theme.spacing.unit,
  },
  buttonText: {
    color: theme.custom.colors.common.white,
  },
}));

type ExternalProps = {|
  error: Error,
  retry: ?() => void,
  allowRetry?: boolean,
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
function ErrorView({
  retry,
  allowRetry,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let content;
  if (allowRetry && retry != null) {
    content = (
      <div className={classes.retryArea}>
        <Typography type="subheading">
          Try going back to where you were, refreshing the page, or clicking reload below.
        </Typography>
        <Button
          className={classes.reloadButton}
          onClick={retry}
          raised
          color="primary"
        >
          <Typography className={classes.buttonText} type="body1">
            RELOAD
          </Typography>
        </Button>
      </div>
    );
  } else {
    content = (
      <Typography type="subheading">
        Try going back to where you were or refreshing the page.
      </Typography>
    );
  }
  return (
    <div className={classNames(classes.root, className)}>
      <Logo width={48} height={56} />
      <Typography type="headline" className={classes.headline}>
        Something went wrong!
      </Typography>
      {content}
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(ErrorView): Class<React.Component<void, ExternalProps, void>>);
