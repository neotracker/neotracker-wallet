/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import { Link } from '~/src/lib/components/shared/link';
import {
  Typography,
} from '~/src/lib/components/shared/base';

import * as routes from '~/src/shared/routes';

const styleSheet = createStyleSheet('AddressLink', theme => ({
  highlighted: {
    color: theme.palette.accent.A200,
    fontWeight: theme.typography.fontWeightRegular,
    textDecoration: 'none',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));


type ExternalProps = {|
  addressHash: string,
  highlighted?: boolean,
  white?: boolean,
  absolute?: 'main' | 'test',
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
function AddressLink({
  addressHash,
  highlighted,
  white,
  absolute,
  className,
  styleManager,
}: Props): React.Element<any> {
  const classes = styleManager.render(styleSheet);
  if (highlighted) {
    return (
      <Typography
        className={classes.highlighted}
        type="body1"
      >
        {addressHash}
      </Typography>
    )
  }
  let path = routes.makeAddress(addressHash);
  const isAbsolute = absolute != null;
  if (isAbsolute) {
    path = routes.makeURL({ testNet: absolute === 'test', path });
  }
  return (
    <Link
      className={className}
      type="body1"
      path={path}
      title={addressHash}
      white={white}
      absolute={isAbsolute}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(AddressLink): Class<React.Component<void, ExternalProps, void>>);
