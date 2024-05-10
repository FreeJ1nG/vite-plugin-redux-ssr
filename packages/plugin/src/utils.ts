import {
  PayloadAction,
  Action,
  UnknownAction,
  type ThunkAction,
} from "@reduxjs/toolkit";

const HYDRATE = "__REDUX_STORE_HYDRATE__";

export interface InitStoreMetadata {
  page: string;
  load: ThunkAction<any, any, any, UnknownAction>[];
}

export function isHydrateAction(action: Action): action is PayloadAction {
  return action.type === HYDRATE;
}
