// @flow weak
import React from 'react';
import classNames from 'classnames';
import { createStyleSheet } from 'jss-theme-reactor';

import withStyles from '~/src/lib/transform/components/withStyles';

const THICKNESS = 3.6;
const PI = 3.1416; // Simple version of Math.PI for the CSS generated.
const TMP_SIZE = 40;

function getRelativeValue(value, min, max) {
  const clampedValue = Math.min(Math.max(min, value), max);
  return (clampedValue - min) / (max - min);
}

function calcFallback(progress, size, negative) {
  const result = (progress * size / 100 - THICKNESS) * PI;
  return negative ? result * -1 : result;
}

const styleSheet = createStyleSheet('CircularProgress', theme => {
  // eslint-disable-next-line
  const THICKNESS = 3.6;
  // eslint-disable-next-line
  const PI = 3.1416; // Simple version of Math.PI for the CSS generated.
  // eslint-disable-next-line
  const TMP_SIZE = 40;
  // eslint-disable-next-line
  function calcFallback(progress, size, negative) {
    const result = (progress * size / 100 - THICKNESS) * PI;
    return negative ? result * -1 : result;
  }
  return ({
    root: {
      display: 'inline-block',
      color: theme.palette.primary[500],
    },
    svg: {
      transform: 'rotate(-90deg)',
    },
    indeterminateSvg: {
      // The main animation is loop 4 times (4 / 3 * 1300).
      animation: 'mui-rotate-progress-circle 1733ms linear infinite',
    },
    circle: {
      stroke: 'currentColor',
      strokeLinecap: 'square',
      transition: theme.transitions.create('all', { duration: 1300 }),
    },
    indeterminateCircle: {
      strokeDasharray: `1, ${calcFallback(100, TMP_SIZE)}`,
      strokeDashoffset: '0%',
      animation: `mui-scale-progress-circle 1300ms ${theme.transitions.easing.easeInOut} infinite`,
    },
    determinateCircle: {
      willChange: 'strokeDasharray',
      strokeDashoffset: '0%',
    },
    '@keyframes mui-rotate-progress-circle': {
      '0%': {
        transform: 'rotate(-90deg)',
      },
      '100%': {
        transform: 'rotate(270deg)',
      },
    },
    '@keyframes mui-scale-progress-circle': {
      '8%': {
        strokeDasharray: `1, ${calcFallback(100, TMP_SIZE)}`,
        strokeDashoffset: 0,
      },
      '50%, 58%': {
        // eslint-disable-next-line max-len
        strokeDasharray: `${calcFallback(65, TMP_SIZE)}, ${calcFallback(100, TMP_SIZE)}`,
        strokeDashoffset: `${calcFallback(25, TMP_SIZE, true)}`,
      },
      '100%': {
        // eslint-disable-next-line max-len
        strokeDasharray: `${calcFallback(65, TMP_SIZE)}, ${calcFallback(100, TMP_SIZE)}`,
        strokeDashoffset: `${calcFallback(99, TMP_SIZE, true)}`,
      },
    },
  });
});

function CircularProgress(props) {
  const { classes, className, size, mode, value, min, max, ...other } = props;
  const radius = size / 2;
  const rootProps = {};
  const svgClasses = classNames(classes.svg, {
    [classes.indeterminateSvg]: mode === 'indeterminate',
  });

  const circleClasses = classNames(classes.circle, {
    [classes.indeterminateCircle]: mode === 'indeterminate',
    [classes.determinateCircle]: mode === 'determinate',
  });

  const circleStyle = {};
  if (mode === 'determinate') {
    const relVal = getRelativeValue(value, min, max);

    circleStyle.strokeDasharray =
      // eslint-disable-next-line
      (calcFallback(100, TMP_SIZE) * relVal).toString() + ',' + calcFallback(100, TMP_SIZE).toString();

    rootProps['aria-valuenow'] = value;
    rootProps['aria-valuemin'] = min;
    rootProps['aria-valuemax'] = max;
  }

  return (
    <div
      className={classNames(classes.root, className)}
      style={{ width: size, height: size }}
      role="progressbar"
      {...rootProps}
      {...other}
    >
      <svg className={svgClasses} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={circleClasses}
          style={circleStyle}
          cx={radius}
          cy={radius}
          r={radius - THICKNESS / 2}
          fill="none"
          strokeWidth={THICKNESS}
          strokeMiterlimit="20"
        />
      </svg>
    </div>
  );
}

CircularProgress.defaultProps = {
  size: 40,
  mode: 'indeterminate',
  value: 0,
  min: 0,
  max: 100,
};

export default withStyles(styleSheet)(CircularProgress);
