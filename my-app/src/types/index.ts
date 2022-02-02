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

export type PokemonCardProps = {
  id: number;
  onClick: (id: number) => void;
  baseURL: string;
};
