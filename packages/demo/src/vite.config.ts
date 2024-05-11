import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import reduxSsrPlugin, { type InitStoreMetadata } from 'vite-plugin-redux-ssr';

import { pokemonApi } from '@/features/pokemon/api.js';
import { makeStore } from '@/modules/redux/store.js';

const pages: InitStoreMetadata = {
  '/': [
    pokemonApi.endpoints.getPokemons.initiate({ limit: 20, offset: 0 }),
    pokemonApi.endpoints.getPokemonDetail.initiate({ name: 'Bulbasaur' }),
  ],
};

export default defineConfig({
  plugins: [react(), reduxSsrPlugin({ makeStore, pages })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
