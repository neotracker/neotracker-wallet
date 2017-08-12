/* @flow */
import {
  type GraphQLTaggedNode,
  createFragmentContainer,
} from 'react-relay';
import React from 'react';

import { getFragment, getSelectorsFromObject } from 'relay-runtime';

import { compose, getContext, withProps } from 'recompose';

let fragmentContainer;
if (process.env.BUILD_FLAG_IS_SERVER) {
  fragmentContainer = (fragments: { [key: string]: GraphQLTaggedNode }) => {
    const fragmentSpec = {};
    for (const [key, fragment] of Object.entries(fragments)) {
      fragmentSpec[key] = getFragment(fragment);
    }
    return compose(
      getContext({ relay: () => null }),
      withProps((props) => {
        const selectors = getSelectorsFromObject(
          props.relay,
          fragmentSpec,
          props,
        );
        return Object.entries(selectors).reduce(
          (res, [key, selector]) => {
            if (Array.isArray(selector)) {
              res[key] = selector.map(
                sel => props.relay.environment.lookup(sel).data,
              );
            } else if (selector == null && Array.isArray(props[key])) {
              res[key] = [];
            } else {
              res[key] = props.relay.environment.lookup(selector).data;
            }
            return res;
          },
          {},
        );
      }),
    );
  };
} else {
  fragmentContainer = (fragments: { [key: string]: GraphQLTaggedNode }) =>
    (WrappedComponent: Class<React.Component<any, any, any>>) =>
      createFragmentContainer(WrappedComponent, fragments);
}

const fragmentContainetExport = fragmentContainer;
export default fragmentContainetExport;
