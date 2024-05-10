import { type InitStoreMetadata } from "vite-plugin-redux-ssr";
import { pokemonApi } from "./features/api.js";

export const initStoreMetadata: InitStoreMetadata = {
  page: "root",
  load: [
    pokemonApi.endpoints.getPokemons.initiate({ limit: 20, offset: 0 }),
    pokemonApi.endpoints.getPokemonDetail.initiate({ name: "Bulbasaur" }),
  ],
};
