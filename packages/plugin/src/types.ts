import { UnknownAction, type ThunkAction } from "@reduxjs/toolkit";

export interface InitStoreMetadata {
  page: string;
  load: ThunkAction<any, any, any, UnknownAction>[];
}
