import {
  type Action,
  configureStore,
  type ThunkDispatch,
} from '@reduxjs/toolkit';
import { useDispatch, useStore } from 'react-redux';

import api from './api.js';
import { reducer } from './reducer.js';

/**
 * A store creator function that supports HMR for replacing it's reducers
 */
export const makeStore = (
  preloadedState?: ReturnType<typeof reducer>,
  ssr: boolean = false,
) => {
  const store = configureStore({
    preloadedState,
    reducer,
    middleware: (gdm) => gdm().concat(api.middleware),
  });

  if (!ssr && import.meta.hot) {
    import.meta.hot.accept('./reducer.ts', () => {
      store.replaceReducer(reducer);
    });
  }

  return store;
};

/**
 * Stongly typed store based on the return type of makeStore
 */
export type AppStore = ReturnType<typeof makeStore>;

/**
 * Strongly typed root state based on the return value of store.getState()
 */
export type RootState = ReturnType<AppStore['getState']>;

/**
 * Strongly typed store dispatch method
 * Keep in mind that since the store has the thunk middleware configured, both
 * ThunkDispatch and Store dispatch are supported
 */
export type AppDispatch = AppStore['dispatch'] &
  ThunkDispatch<RootState, void, Action>;

/**
 * Strongly typed useStore hook based on AppStore type
 */
export const useAppStore = useStore.withTypes<AppStore>();

/**
 * Strongly typed useDispatch hook based on AppDispatch type
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
