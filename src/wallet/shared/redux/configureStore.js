/* @flow */
import { createStore } from 'redux';
import { persistStore } from 'redux-persist';

import reducer from './index';

export default (initialState: Object = {}) => {
  const store = createStore(
    reducer,
    initialState,
  );

  if (process.env.BUILD_FLAG_IS_CLIENT) {
    persistStore(store);
  }

  return store;
};
