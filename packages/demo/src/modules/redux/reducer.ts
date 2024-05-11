import { combineReducers } from 'redux';

import api from './api.js';

/**
 * Combined reducers that collects all the reducers used in the app
 */
export const reducer = combineReducers({
  [api.reducerPath]: api.reducer,
});
