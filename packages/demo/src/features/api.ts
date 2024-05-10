import api from "@/modules/redux/api.js";
import {
  GetPokemonDetailParam,
  GetPokemonDetailResponse,
  GetPokemonsParam,
  GetPokemonsResponse,
} from "./types.js";

export const pokemonApi = api.injectEndpoints({
  overrideExisting: import.meta.env.DEV,
  endpoints: (builder) => ({
    getPokemons: builder.query<GetPokemonsResponse, GetPokemonsParam>({
      query: ({ limit, offset }) => ({
        url: `/pokemon?limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
    }),
    getPokemonDetail: builder.query<
      GetPokemonDetailResponse,
      GetPokemonDetailParam
    >({
      query: ({ name }) => ({
        url: `/pokemon/${name}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPokemonsQuery,
  useLazyGetPokemonsQuery,
  useGetPokemonDetailQuery,
  useLazyGetPokemonDetailQuery,
} = pokemonApi;
