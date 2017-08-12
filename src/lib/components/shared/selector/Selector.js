/* @flow */
import React from 'react';

import classNames from 'classnames';
import {
  compose,
  getContext,
  pure,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { createStyleSheet } from 'jss-theme-reactor';

import { type AppStyleManager } from '~/src/shared/styles/createStyleManager';
import {
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('Selector', theme => ({
  root: {
    flex: '1 1 auto',
    background: theme.palette.background.paper,
  },
  list: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  listItemTextRoot: {
    minWidth: 0,
    '& > h3': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'no-wrap',
    }
  },
  menuRoot: {
    maxWidth: '80%',
  },
}));

type Option = {
  id: string,
  text: string,
};

type ExternalProps = {|
  id: string,
  label: string,
  options: Array<Option>,
  selectedID: ?string,
  selectText: string,
  onSelect: (option: Option) => void,
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  open: boolean,
  anchorEl: any,
  onClickMenu: () => void,
  onClickMenuItem: (event: Object, option: Option) => void,
  onClose: () => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function Selector({
  id: idIn,
  label,
  options,
  selectedID,
  selectText,
  className,
  open,
  anchorEl,
  onClickMenu,
  onClickMenuItem,
  onClose,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const id = `selector-${idIn}`;
  const selectedOption = options.find(option => option.id === selectedID);
  let selectedText = selectText;
  if (selectedOption != null) {
    selectedText = selectedOption.text;
  }
  return (
    <div className={classNames(className, classes.root)}>
      <List className={classes.list}>
        <ListItem
          button
          aria-haspopup="true"
          aria-controls={id}
          aria-label={label}
          onClick={onClickMenu}
        >
          <ListItemText
            classes={{
              root: classes.listItemTextRoot,
            }}
            primary={selectedText}
          />
        </ListItem>
      </List>
      <Menu
        className={classes.menuRoot}
        id={id}
        anchorEl={anchorEl}
        open={open}
        onRequestClose={onClose}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.id === selectedID}
            onClick={event => onClickMenuItem(event, option)}
          >
            <ListItemText
              classes={{
                root: classes.listItemTextRoot,
              }}
              primary={option.text}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  withState('state', 'setState', () => ({
    open: false,
    anchorEl: null,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onClickMenu: ({ setState }) => (event) => {
      const anchorEl = event.currentTarget;
      setState(prevState => ({
        ...prevState,
        open: true,
        anchorEl,
      }));
    },
    onClickMenuItem: ({ onSelect, setState }) => (event, option) => {
      onSelect(option);
      setState(prevState => ({
        ...prevState,
        open: false,
      }));
    },
    onClose: ({ setState }) => () => setState(prevState => ({
      ...prevState,
      open: false,
    })),
  }),
  pure,
)(Selector): Class<React.Component<void, ExternalProps, void>>);
