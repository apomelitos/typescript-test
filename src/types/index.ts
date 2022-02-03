// PokemonsList
export type PokemonsListItem = {
  name: string;
  url: string;
};

export type PokemonsListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonsListItem[];
};

export type PokemonType = {
  base_experience: number;
  height: number;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  name: string;
  order: number;
  weight: number;
  past_types: [];
  held_items: [];
  sprites: { front_default: string };
  species: { url: string };
  isOk: true;
};

// PokemonCard
export type PokemonCardProps = {
  id: number;
  onClick: (id: number) => void;
  baseURL: string;
};

/// EvolutionsList
export type EvolutionChain = {
  evolution_details: { min_happiness: number }[];
  evolves_to: EvolutionChain[];
  is_baby: boolean;
  species: { name: string; url: string };
  sprite?: string;
};

export type EvolutionsListProps = {
  pokemonSpeciesURL: string;
};

export type SpecieType = {
  evolution_chain: { url: string };
};

export type EvolutionChainResponse = {
  chain: EvolutionChain;
};

// PokemonDetails
export type PokemonDetailsProps = {
  id: number;
  baseURL: string;
};
