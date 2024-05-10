import { combineReducers } from "redux";
import api from "./api.js";

export const reducer = combineReducers({
  [api.reducerPath]: api.reducer,
});
