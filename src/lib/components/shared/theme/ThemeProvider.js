/* @flow */
import React from 'react';

import {
  compose,
  withContext,
  pure,
} from 'recompose';

type ExternalProps = {|
  styleManager: any,
  children?: any,
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
function ThemeProvider({
  children,
}: Props): ?React.Element<*> {
  return children;
}

export default (compose(
  withContext(
    { styleManager: () => null },
    ({ styleManager }) => ({ styleManager }),
  ),
  pure,
)(ThemeProvider): Class<React.Component<void, ExternalProps, void>>);
