/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';

import { PageLoading } from '~/src/shared/components/common/loading';

import RightPager from './RightPager';

type ExternalProps = {|
  content: React.Element<any>,
  isInitialLoad: boolean,
  isLoadingMore: boolean,
  page: number,
  total: ?number,
  pageSize: number,
  onUpdatePage: (page: number) => void,
  error?: ?string,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {||};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function PagingView({
  content,
  isInitialLoad,
  isLoadingMore,
  error,
  className,
  page,
  total,
  pageSize,
  onUpdatePage,
}: Props): React.Element<*> {
  return (
    <div className={className}>
      {isInitialLoad
        ? <PageLoading />
        : content
      }
      <RightPager
        page={page}
        total={total}
        pageSize={pageSize}
        onUpdatePage={onUpdatePage}
        isLoading={isLoadingMore}
        error={error}
      />
    </div>
  );
}

export default (compose(
  pure,
)(PagingView): Class<React.Component<void, ExternalProps, void>>);
