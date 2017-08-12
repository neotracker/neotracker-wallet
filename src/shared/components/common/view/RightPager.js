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
import { Pager } from '~/src/lib/components/shared/pager';

const styleSheet = createStyleSheet('RightPager', theme => ({
  [theme.breakpoints.down('sm')]: {
    pagerArea: {
      padding: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    pagerArea: {
      padding: theme.spacing.unit * 2,
    },
  },
  pagerArea: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

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
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function RightPager({
  page,
  total,
  pageSize,
  onUpdatePage,
  isLoading,
  error,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={classNames(classes.pagerArea, className)}>
      <Pager
        page={page}
        total={total}
        pageSize={pageSize}
        onUpdatePage={onUpdatePage}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(RightPager): Class<React.Component<void, ExternalProps, void>>);
