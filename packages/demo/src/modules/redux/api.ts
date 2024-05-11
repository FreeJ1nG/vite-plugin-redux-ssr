import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { isHydrateAction } from 'vite-plugin-redux-ssr';

import { type RootState } from './store.js';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pokeapi.co/api/v2',
  }),
  tagTypes: [],
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction<RootState>(action)) {
      return action.payload[reducerPath];
    }
  },
  endpoints: () => ({}),
});

export default api;
