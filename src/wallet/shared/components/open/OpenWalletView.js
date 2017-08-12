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
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '~/src/lib/components/shared/base';

import OpenWalletKeystore from './OpenWalletKeystore';
import OpenWalletPrivateKey from './OpenWalletPrivateKey';

const styleSheet = createStyleSheet('OpenWalletView', theme => ({
  [theme.breakpoints.down('sm')]: {
    root: {
      paddingLeft: theme.spacing.unit,
      paddingTop: theme.spacing.unit,
    },
    margin: {
      marginRight: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      paddingLeft: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit,
    },
    margin: {
      marginRight: theme.spacing.unit * 2,
    },
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    marginBottom: theme.spacing.unit,
  },
}));

type Option =
  'keystore' |
  'privatekey' |
  'neo-db';

type ExternalProps = {|
  className?: string,
|};
// eslint-disable-next-line
type InternalProps = {|
  option: Option,
  onSelectOption: (event: Object, option: Option) => void,
  styleManager: AppStyleManager,
|};
/* ::
type Props = {|
  ...ExternalProps,
  ...InternalProps,
|};
*/
function OpenWalletView({
  className,
  option,
  onSelectOption,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  let open;
  switch (option) {
    case 'keystore':
      open = <OpenWalletKeystore className={classes.margin} />;
      break;
    case 'privatekey':
      open = <OpenWalletPrivateKey className={classes.margin} />;
      break;
    case 'neo-db':
      // open = <OpenWalletNEODB />;
      break;
    default:
      open = null;
  }
  return (
    <div className={classNames(className, classes.root)}>
      <FormControl className={classes.margin} required>
        <FormLabel>How would you like to access your wallet?</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          selectedValue={option}
          onChange={onSelectOption}
        >
          <FormControlLabel
            value="keystore"
            control={<Radio />}
            label="Keystore File (UTC / JSON)"
          />
          <FormControlLabel
            value="privatekey"
            control={<Radio />}
            label="Private Key"
          />
          {/* <FormControlLabel
            value="neo-db"
            control={<Radio />}
            label="NEO/AntShares DB File"
          /> */}
        </RadioGroup>
      </FormControl>
      {open}
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  withState('state', 'setState', () => ({
    option: null,
  })),
  withProps(({ state }) => state),
  withHandlers({
    onSelectOption: ({ setState }) => (event, option) => setState(
      prevState => ({
        ...prevState,
        option,
      }),
    ),
  }),
  pure,
)(OpenWalletView): Class<React.Component<void, ExternalProps, void>>);
