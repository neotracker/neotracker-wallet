/* @flow */
import React from 'react';

import { compose, pure } from 'recompose';

type ExternalProps = {|
  id: string,
|};
// eslint-disable-next-line
type InternalProps = {|
|}
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
// eslint-disable-next-line
function TitleLogo({ id }: Props): React.Element<*> {
  const a = `${id}a`;
  const b = `${id}b`;
  return (
    <svg
      width="145px"
      height="28px"
      viewBox="0 0 145 28"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="[title]"
    >
      <title id={`${id}Title`}>NEO Tracker Blockchain Explorer</title>
      <desc id={`${id}Description`}>NEO Tracker Blockchain Explorer</desc>
      <defs>
        <linearGradient x1="45.734%" y1="-4.797%" x2="45.392%" y2="144.834%" id={a}>
          <stop stopColor="#58BE23" offset="0%"/>
          <stop stopColor="#58BE23" stopOpacity="0" offset="100%"/>
        </linearGradient>
        <linearGradient x1="40.502%" y1="1.637%" x2="44.803%" y2="114.732%" id={b}>
          <stop stopColor="#58BE23" offset="0%"/>
          <stop stopColor="#58BE23" stopOpacity="0" offset="100%"/>
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g fillRule="nonzero">
          <path stroke="#58BE23" strokeWidth=".265" fill="#58BE23" d="M9.596 9.367l13.428-4.873L13.806.05.61 4.99z"/>
          <path fill={`url(#${a})`} d="M23.455 5.124l-9.715 3.38.033 10.047 9.582 4.545"/>
          <path fill={`url(#${b})`} d="M9.264 9.997L.047 5.587l.066 17.838 9.184 4.443"/>
        </g>
        <text fontFamily="Roboto-Medium, Roboto" fontSize="20" fontWeight="400" fillOpacity=".87" fill="#000">
          <tspan x="31.62" y="19">NEO Tracker</tspan>
        </text>
      </g>
    </svg>
  );
}

export default (compose(
  pure,
)(TitleLogo): Class<React.Component<void, ExternalProps, void>>);
