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
import {
  Button,
  Typography,
} from '~/src/lib/components/shared/base';

const styleSheet = createStyleSheet('NewWalletSaveCommon', theme => ({
  [theme.breakpoints.down('sm')]: {
    content: {
      padding: theme.spacing.unit,
    },
    save: {
      paddingBottom: theme.spacing.unit,
      paddingTop: theme.spacing.unit,
    },
  },
  [theme.breakpoints.up('sm')]: {
    content: {
      padding: theme.spacing.unit * 2,
    },
    save: {
      paddingBottom: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2,
    },
  },
  content: {},
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  textLine: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  save: {},
  bold: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  firstText: {
    marginRight: theme.spacing.unit / 2,
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: `1px solid ${theme.palette.text.lightDivider}`,
  },
}));

type ExternalProps = {|
  title: string,
  saveElement: React.Element<any>,
  saved: boolean,
  onContinue: () => void,
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
function NewWalletSaveCommon({
  title,
  saveElement,
  saved,
  onContinue,
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  const textLines = [
    ['Do not lose it!', 'It cannot be recovered if you lose it.'],
    [
      'Do not share it!',
      'Your funds will be stolen if you use this file on a malicious phishing' +
      ' site.'
    ],
    [
      'Make a backup!',
      'Secure it like the millions of dollars it may one day be worth.',
    ],
  ];
  return (
    <div className={classNames(className, classes.root)}>
      <div className={classes.content}>
        <Typography type="subheading">
          {title}
        </Typography>
        <div className={classes.save}>
          {saveElement}
        </div>
        {textLines.map(([first, second]) => (
          <div key={first} className={classes.textLine}>
            <Typography
              type="body1"
              className={classNames(classes.firstText, classes.bold)}
            >
              {first}
            </Typography>
            <Typography type="body1">
              {second}
            </Typography>
          </div>
        ))}
      </div>
      <div className={classNames(classes.content, classes.footer)}>
        <Button
          disabled={!saved}
          color="primary"
          onClick={onContinue}
        >
          <Typography color="inherit" type="body1">
            CONTINUE
          </Typography>
        </Button>
      </div>
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(NewWalletSaveCommon): Class<React.Component<void, ExternalProps, void>>);
