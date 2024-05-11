import api from '@/modules/redux/api.js';

import {
  type GetPokemonDetailParam,
  type GetPokemonDetailResponse,
  type GetPokemonsParam,
  type GetPokemonsResponse,
} from './types.js';

/**
 * Any endpoints relating to pokemons will be defined here
 * Other advanced configurations are possible if needed
 */
export const pokemonApi = api.injectEndpoints({
  overrideExisting: import.meta.env.DEV,
  endpoints: (builder) => ({
    getPokemons: builder.query<GetPokemonsResponse, GetPokemonsParam>({
      query: ({ limit, offset }) => ({
        url: `/pokemon?limit=${limit}&offset=${offset}`,
        method: 'GET',
      }),
    }),
    getPokemonDetail: builder.query<
      GetPokemonDetailResponse,
      GetPokemonDetailParam
    >({
      query: ({ name }) => ({
        url: `/pokemon/${name}`,
        method: 'GET',
      }),
    }),
  }),
});

/**
 * Exported hooks for the application to use
 */
export const {
  useGetPokemonsQuery,
  useLazyGetPokemonsQuery,
  useGetPokemonDetailQuery,
  useLazyGetPokemonDetailQuery,
} = pokemonApi;
