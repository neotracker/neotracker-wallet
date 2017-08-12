/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';

import { Card } from '~/src/lib/components/shared/base';
import { CenteredView } from '~/src/lib/components/shared/layout';

import PageViewHeader from './PageViewHeader';
import TableView from './TableView';

type ExternalProps = {|
  id: string,
  title: string,
  name: string,
  pluralName: string,
  searchRoute: string,
  headerIcon?: string,
  headerBackgroundColorClassName?: string,
  bodyColumns: Array<
    [string, React.Element<any> | string] |
    [string, React.Element<any> | string, number]
  >,
  extraCard?: any,
  extra?: any,
  children?: any,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function PageView({
  id,
  title,
  name,
  pluralName,
  searchRoute,
  headerIcon,
  headerBackgroundColorClassName,
  bodyColumns,
  extraCard,
  extra,
  className,
}: Props): React.Element<*> {
  return (
    <CenteredView className={className}>
      <Card>
        <PageViewHeader
          id={id}
          title={title}
          name={name}
          pluralName={pluralName}
          searchRoute={searchRoute}
          icon={headerIcon}
          backgroundColorClassName={headerBackgroundColorClassName}
        />
        <TableView columns={bodyColumns} />
        {extraCard}
      </Card>
      {extra}
    </CenteredView>
  );
}

export default (compose(
  pure,
)(PageView): Class<React.Component<void, ExternalProps, void>>);
