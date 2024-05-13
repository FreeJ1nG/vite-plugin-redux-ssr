import { type ReactNode } from 'react';
import { type InitStoreFn } from 'vite-plugin-redux-ssr';

import { pokemonApi } from './features/pokemon/api.js';

/**
 * Main page that will be used for the demo
 */
export default function App(): ReactNode {
  return <div></div>;
}

/**
 * Store initialization function
 */
export const initStore: InitStoreFn = () => {
  return {
    route: '/',
    load: [
      pokemonApi.endpoints.getPokemons.initiate({ limit: 20, offset: 0 }),
      pokemonApi.endpoints.getPokemonDetail.initiate({ name: 'Bulbasaur' }),
    ],
  };
};
