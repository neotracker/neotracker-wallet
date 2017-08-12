/* @flow */
import BigNumber from 'bignumber.js';
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
  withHandlers,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import {
  CircularProgress,
  Icon,
  IconButton,
  Typography,
} from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('Pager', theme => ({
  root: {
    alignItems: 'center',
    display: 'flex',
  },
  count: {
    ...theme.typography.caption,
    paddingRight: theme.spacing.unit * 2,
  },
  error: {
    color: theme.palette.error[500],
  },
  margin: {
    marginRight: theme.spacing.unit * 2,
  },
}));

const formatNumber = (value: number | string) =>
  new BigNumber(value).toFormat();

type ExternalProps = {|
  page: number,
  total: ?number,
  pageSize: number,
  onUpdatePage: (page: number) => void,
  isLoading?: boolean,
  error?: ?string,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  onDecrementPage: () => void,
  onIncrementPage: () => void,
  styleManager: any,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function Pager({
  page,
  total,
  pageSize,
  isLoading,
  error,
  className,
  onDecrementPage,
  onIncrementPage,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let start = 1;
  let end = 1;
  let totalElement = (
    <span className={classes.count}>
      0 - 0
    </span>
  );
  if (total != null) {
    start = ((page - 1) * pageSize) + 1;
    end = Math.min(page * pageSize, total);
    if (end === 0) {
      start = 0;
    }
    totalElement = (
      <span className={classes.count}>
        {`${formatNumber(start)} - ${formatNumber(end)} of ${formatNumber(total)}`}
      </span>
    );
  }

  return (
    <div className={classNames(classes.root, className)}>
      {
        error != null
          ? <Typography
            className={classNames(classes.margin, classes.error)}
            type="body1"
          >
            {error}
          </Typography>
          : null
      }
      {isLoading
        ? <CircularProgress size={32} className={classes.margin} />
        : null
      }
      {totalElement}
      <IconButton
        disabled={isLoading || start === 0 || start === 1 || total == null}
        onClick={onDecrementPage}
      >
        <Icon>keyboard_arrow_left</Icon>
      </IconButton>
      <IconButton
        disabled={isLoading || end === 0 || end === total || total == null}
        onClick={onIncrementPage}
      >
        <Icon>keyboard_arrow_right</Icon>
      </IconButton>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  withHandlers({
    onIncrementPage: ({ page, onUpdatePage }) => () => onUpdatePage(page + 1),
    onDecrementPage: ({ page, onUpdatePage }) => () => onUpdatePage(page - 1),
  }),
  pure,
)(Pager): Class<React.Component<void, ExternalProps, void>>);
