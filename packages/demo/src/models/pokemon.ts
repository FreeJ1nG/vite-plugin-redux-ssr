export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonStat {
  base_stat: number;
  effort: 0;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonDetail {
  stats: PokemonStat[];
  types: PokemonType[];
  sprites: PokemonSprites;
  abilities: PokemonAbility[];
  cries: {
    latest: string;
    legacy: string;
  };
}
