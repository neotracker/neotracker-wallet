/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
  withHandlers,
  withState,
  withProps,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Card,
  Collapse,
  IconButton,
  Typography,
} from '~/src/lib/components/shared/base';
import {
  Chevron,
} from '~/src/lib/components/shared/animated';

const styleSheet = createStyleSheet('ExpandoCard', theme => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      marginTop: theme.spacing.unit,
    },
    padding: {
      paddingBottom: theme.spacing.unit,
      paddingTop: theme.spacing.unit,
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      marginTop: theme.spacing.unit * 2,
    },
    padding: {
      paddingBottom: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
  },
  root: {},
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  content: {
    borderTop: `1px solid ${theme.palette.text.lightDivider}`,
  },
  padding: {},
  // TODO: Keep in sync with TransactionSummaryHeader and/or extract out
  chevronButton: {
    width: theme.spacing.unit * 5,
    height: theme.spacing.unit * 5,
    marginBottom: -theme.spacing.unit,
    marginRight: -theme.spacing.unit,
    marginTop: -theme.spacing.unit,
  },
}));

type ExternalProps = {|
  title: string,
  content: React.Element<any>,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  showContent: boolean,
  onShowContent: () => void,
  onHideContent: () => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function ExpandoCard({
  title,
  content,
  className,
  showContent,
  onShowContent,
  onHideContent,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const onClickChevron = showContent ? onHideContent : onShowContent;
  return (
    <Card className={classNames(className, classes.root)}>
      <div
        role="presentation"
        className={classNames(classes.header, classes.padding)}
        onClick={onClickChevron}
      >
        <Typography type="title">
          {title}
        </Typography>
        <IconButton
          className={classes.chevronButton}
          onClick={onClickChevron}
        >
          <Chevron up={!showContent} />
        </IconButton>
      </div>
      <Collapse
        in={showContent}
        transitionDuration="auto"
      >
        <div className={classes.content}>
          {content}
        </div>
      </Collapse>
    </Card>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  withState('state', 'setState', ({ initialShowContent }) => ({
    showContent: initialShowContent || false,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onShowContent: ({ setState }) => () => setState(prevState => ({
      ...prevState,
      showContent: true,
    })),
    onHideContent: ({ setState }) => () => setState(prevState => ({
      ...prevState,
      showContent: false,
    })),
  }),
  pure,
)(ExpandoCard): Class<React.Component<void, ExternalProps, void>>);
