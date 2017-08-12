/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';

import Column from './Column';

const styleSheet = createStyleSheet('Table', (theme) => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      '& > div:last-child > div': {
        paddingRight: theme.spacing.unit,
      },
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      '& > div:last-child > div': {
        paddingRight: theme.spacing.unit * 2,
      },
    },
  },
  root: {
    display: 'flex',
  },
}));

type ColumnType = {
  name: string,
  className?: string,
  values: Array<string | React.Element<any>>,
  numeric?: boolean,
  visibleAt?: string,
  minWidth?: boolean,
};

type ExternalProps = {|
  columns: Array<ColumnType>,
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
function Table({
  columns,
  getRowHeight,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={classNames(className, classes.root)}>
      {columns.map((col, idx) => (
        <Column
          key={col.name}
          className={col.className}
          name={col.name}
          values={col.values}
          numeric={col.numeric}
          visibleAt={col.visibleAt}
          firstCol={idx === 0}
          minWidth={col.minWidth}
          getRowHeight={getRowHeight}
        />
      ))}
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(Table): Class<React.Component<void, ExternalProps, void>>);
