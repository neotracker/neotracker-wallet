/* @flow */
import { createStore, combineReducers } from 'redux';
import { persistStore } from 'redux-persist';

import reducers, { flip } from './index';

export default (initialState: Object = {}) => {
  const createReducer = (rootReducer: Object) => combineReducers(Object.assign(
    {},
    rootReducer,
  ));

  const store = createStore(
    createReducer(reducers),
    initialState,
  );

  if (process.env.BUILD_FLAG_IS_DEV && module.hot) {
    // Enable Webpack hot module replacement for reducers. This is so that we
    // don't lose all of our current application state during hot reloading.
    // $FlowFixMe
    module.hot.accept('./index', () => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('./index').default;

      store.replaceReducer(createReducer(nextRootReducer));
    });
  }

  if (process.env.BUILD_FLAG_IS_CLIENT) {
    setInterval(
      () => store.dispatch(flip()),
      1000,
    );

    persistStore(store);
  }

  return store;
};
