/* @flow */
import React from 'react';

import {
  compose,
  getContext,
  pure,
} from 'recompose';
import qr from 'qr-image';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';

type ExternalProps = {|
  value: string,
  size: number,
  alt: string,
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
function QRCode({
  value,
  size,
  alt,
  className,
}: Props): React.Element<*> {
  const buffer = qr.imageSync(value, { margin: 0 });
  const dataURI = `data:image/png;base64,${buffer.toString('base64')}`;
  return (
    <img
      alt={alt}
      className={className}
      src={dataURI}
      width={`${size}px`}
      height={`${size}px`}
    />
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(QRCode): Class<React.Component<void, ExternalProps, void>>);
