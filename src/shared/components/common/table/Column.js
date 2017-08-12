/* @flow */
/* eslint-disable react/no-array-index-key */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  Hidden,
  Typography,
} from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('Column', theme => ({
  [theme.breakpoints.down('sm')]: {
    paddingLeft: {
      paddingLeft: theme.spacing.unit,
    },
    firstCol: {
      paddingLeft: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: {
      paddingLeft: theme.spacing.unit * 3,
    },
    firstCol: {
      paddingLeft: theme.spacing.unit * 2,
    },
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: {
      paddingLeft: theme.spacing.unit * 5,
    },
  },
  root: {
    flex: '1 1 auto',
    flexDirection: 'column',
  },
  minWidth: {
    minWidth: '0',
  },
  alwaysVisible: {
    display: 'flex',
  },
  baseRow: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.lightDivider}`,
    minHeight: 48,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  row: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.text.primary,
  },
  header: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.secondary,
  },
  textRowBase: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  oddRow: {
    backgroundColor: theme.palette.text.lightDivider,
  },
  numeric: {
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  paddingLeft: {},
  firstCol: {},
}));

type ExternalProps = {|
  name: string,
  values: Array<string | React.Element<any>>,
  numeric?: boolean,
  minWidth?: boolean,
  visibleAt?: string,
  firstCol: boolean,
  getRowHeight?: (idx: number) => ?number,
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
function Column({
  name,
  values,
  numeric,
  minWidth,
  visibleAt,
  firstCol,
  getRowHeight: getRowHeightIn,
  className,
  styleManager,
}: Props): React.Element<any> {
  const classes = styleManager.render(styleSheet);
  // eslint-disable-next-line
  const getRowHeight = getRowHeightIn || ((idx: number) => null);
  const wrapValue = (value) => (
    typeof value === 'string'
      ? <Typography
        className={classNames(classes.textRowBase, classes.row)}
        type="body1"
      >
        {value}
      </Typography>
      : value
  );
  const cells = values.map((value, idx) => {
    let style;
    const rowHeight = getRowHeight(idx);
    if (rowHeight != null) {
      style = { height: rowHeight };
    }
    return (
      <div
        key={idx}
        className={classNames({
          [classes.paddingLeft]: !firstCol,
          [classes.firstCol]: firstCol,
          [classes.baseRow]: true,
          [classes.row]: true,
          [classes.oddRow]: idx % 2 === 1,
          [classes.numeric]: !!numeric,
        })}
        style={style}
      >
        {wrapValue(value)}
      </div>
    );
  });
  const element = (
    <div className={classNames({
      [classes.root]: true,
      [classes.alwaysVisible]: true,
      [classes.minWidth]: !minWidth,
    }, className)}>
      <div
        className={classNames({
          [classes.paddingLeft]: !firstCol,
          [classes.firstCol]: firstCol,
          [classes.baseRow]: true,
          [classes.numeric]: !!numeric,
        })}
      >
        <Typography
          className={classNames(classes.textRowBase, classes.header)}
          type="body1"
        >
          {name}
        </Typography>
      </div>
      {cells}
    </div>
  );

  if (process.env.BUILD_FLAG_IS_SERVER) {
    return element;
  }

  return (
    <Hidden
      xsDown={visibleAt === 'xs'}
      smDown={visibleAt === 'sm'}
      mdDown={visibleAt === 'md'}
      lgDown={visibleAt === 'lg'}
      xlDown={visibleAt === 'xl'}
      implementation="js"
    >
      {element}
    </Hidden>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(Column): Class<React.Component<void, ExternalProps, void>>);
