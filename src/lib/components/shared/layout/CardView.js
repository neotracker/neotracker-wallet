/* @flow */
import React from 'react';

import {
  compose,
  pure,
} from 'recompose';

import CenteredView from './CenteredView';
import TitleCard from './TitleCard';

type ExternalProps = {|
  title: string,
  extra?: React.Element<any>,
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
function CardView({
  title,
  children,
  extra,
  className,
}: Props): React.Element<*> {
  return (
    <CenteredView className={className}>
      <TitleCard title={title}>
        {children}
      </TitleCard>
      {extra}
    </CenteredView>
  );
}

export default (compose(
  pure,
)(CardView): Class<React.Component<void, ExternalProps, void>>);
