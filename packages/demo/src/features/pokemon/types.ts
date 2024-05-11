/* eslint-disable jsdoc/require-jsdoc */

import { type Pokemon, type PokemonDetail } from '@/models/pokemon.js';

export interface GetPokemonsParam {
  limit: number;
  offset: number;
}

export interface GetPokemonsResponse {
  count: number;
  results: Pokemon[];
}

export interface GetPokemonDetailParam {
  name: string;
}

export type GetPokemonDetailResponse = PokemonDetail;
