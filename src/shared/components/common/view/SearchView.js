/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';

import { Card } from '~/src/lib/components/shared/base';
import { CenteredView } from '~/src/lib/components/shared/layout';

import CommonHeader from './CommonHeader';

type ExternalProps = {|
  name: string,
  pluralName: string,
  content: React.Element<any>,
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
function SearchView({
  name,
  pluralName,
  content,
  className,
}: Props): React.Element<*> {
  return (
    <CenteredView className={className}>
      <Card>
        <CommonHeader
          name={name}
          pluralName={pluralName}
        />
        {content}
      </Card>
    </CenteredView>
  );
}

export default (compose(
  pure,
)(SearchView): Class<React.Component<void, ExternalProps, void>>);
