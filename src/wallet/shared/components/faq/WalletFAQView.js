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
import { Markdown } from '~/src/lib/components/shared/markdown';

const styleSheet = createStyleSheet('WalletFAQView', theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
  },
}));

const FAQ = `
## What is NEO Tracker Wallet?
NEO Tracker Wallet is a light wallet that lets NEO holders interact with
the NEO blockchain. You do not create an account or give us your funds to hold
onto. No data leaves your computer or your browser. We make it easy for you to
create, save, and access your information and interact with the blockchain.


## How does it work?
Light wallet means that NEO Tracker Wallet does not require syncing locally with
the blockchain and instead, uses a remote server, namely NEO Tracker Blockchain
Explorer, to fetch data like the transaction history or the amount of GAS
available to claim. Note that **none** of your personal data is ever sent to
NEO Tracker. Specifically, your Private Keys and encrypted Keystore files never
leave your local computer.


## How secure is it?
NEO Tracker Wallet **never** sends your Private Keys or encryped Keystore files
across the network. They are stored locally on your computer. Private Keys are
only ever stored in the current session's memory and are cleared between
sessions. Encrypted Keystore files are stored in local storage and persist across
sessions. If an attacker were to gain access to your browser's local storage, they
would additionally need the password to unlock your encrypted Keystore file in order
to gain access to your Private Keys and thus your balance.


## How can I trust NEO Tracker Wallet?
NEO Tracker Wallet source code is available on [Github](https://github.com/neotracker/neotracker-wallet)
for you to verify. We serve the wallet over SSL (https) which eliminates the
possibility of tampering with the Javascript code between our servers and your
browser. Still not sure? Download the latest standalone release on our
[Github releases](https://github.com/neotracker/neotracker-wallet/releases) page
and open it using your browser. Alternatively, you can build directly from the source.


## What if I forget my encrypted Keystore file's password or lose my Private Key?
NEO Tracker Wallet does not hold your keys for you. We cannot access accounts,
recover keys, reset passwords, nor reverse transactions. Protect your keys and
always check that you are on the correct URL. You are responsible for your security.


## We are not responsible for any loss.
NEO, neotracker.io and some of the underlying Javascript libraries we use are
under active development. While we have thoroughly tested, there is always the
possibility something unexpected happens that causes your funds to be lost.
Please do not invest more than you are willing to lose, and please be careful.
`;

type ExternalProps = {|
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
function WalletFAQView({
  className,
  styleManager,
}: Props): React.Element<*> {
  const classes = styleManager.render(styleSheet);
  return (
    <div className={classNames(className, classes.root)}>
      <Markdown
        source={FAQ}
      />
    </div>
  );
}

export default (compose(
  getContext({ styleManager: () => null }),
  pure,
)(WalletFAQView): Class<React.Component<void, ExternalProps, void>>);
