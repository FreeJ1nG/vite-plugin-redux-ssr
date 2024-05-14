import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import reduxSsrPlugin from 'vite-plugin-redux-ssr';

import { makeStore } from './src/modules/redux/store.js';

export default defineConfig({
  plugins: [
    react(),
    reduxSsrPlugin({
      createServerSideStore: (preloadedState) => makeStore(preloadedState, true),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
