import { Pokemon, PokemonDetail } from "@/models/pokemon";

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
