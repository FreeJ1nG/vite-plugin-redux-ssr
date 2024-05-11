import {
  type Action,
  createAction,
  type PayloadAction,
  type Store,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit';

const HYDRATE = '__VITE_PLUGIN_REDUX_SSR_REDUX_STORE_HYDRATE__';

/**
 * A utility store creator type
 */
export type StoreCreator<AppStore extends Store> =
  (preloadedState?: ReturnType<AppStore['getState']>) => AppStore;

/**
 * String constant that will be used as script id for store data passing to the client
 */
export const STORE_DATA_SCRIPT_TAG = '__VITE_PLUGIN_REDUX_SSR_STORE_DATA__';

/**
 * Type definition used for store initialization metadata
 */
export type InitStoreMetadata = Record<string, ThunkAction<any, any, any, UnknownAction>[]>;

/**
 * Utility function used to extract rehydration info
 * @param {Action} action
 */
export const isHydrateAction = <RootState>(action: Action): action is PayloadAction<RootState> => {
  return action.type === HYDRATE;
};

/**
 * A utility function that should only be used by library consumer to export server-side store data
 * @param {Function} makeStore - A store creator function that returns an AppStore instance
 */
export const createClientSideStore = <AppStore extends Store>(makeStore: StoreCreator<AppStore>): AppStore => {
  const serializedStoreData = document.getElementById(STORE_DATA_SCRIPT_TAG);
  if (!serializedStoreData) throw new Error('Unable to get store data from the server side, is the plugin setup properly?');

  const store = makeStore();
  const storeData = JSON.parse(serializedStoreData.innerHTML);
  const hydrate = createAction<string>(HYDRATE);
  store.dispatch(hydrate(storeData));

  return store;
};
