import api from "./api.js";
import { reducer } from "./reducer.js";
import { Action, ThunkDispatch, configureStore } from "@reduxjs/toolkit";

export const makeStore = (preloadedState: ReturnType<typeof reducer>) => {
  const store = configureStore({
    preloadedState,
    reducer,
    middleware: (gdm) => gdm().concat(api.middleware),
  });

  if (import.meta.hot) {
    import.meta.hot.accept("./reducer.ts", () => {
      store.replaceReducer(reducer);
    });
  }

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"] &
  ThunkDispatch<RootState, void, Action>;
