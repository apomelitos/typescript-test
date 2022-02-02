import { useEffect, useState, FC } from 'react';

import { PokemonType, PokemonCardProps } from '../types';

export const PokemonCard: FC<PokemonCardProps> = ({ id, onClick, baseURL }): JSX.Element => {
  const [pokemon, setPokemon] = useState<PokemonType>();

  useEffect(() => {
    const fetchPokemonByid = async (id: number) => {
      const response = await fetch(`${baseURL}/pokemon/${id}`);
      console.log(response);
      const data = (await response.json()) as PokemonType;
      if ('weight' in data && 'base_experience' in data) {
        setPokemon(data);
      }
    };

    fetchPokemonByid(id);
  }, [id, baseURL]);

  return (
    <li
      onClick={() => {
        onClick(id);
      }}
    >
      <h3>{pokemon?.name}</h3>
      <img src={pokemon?.sprites.front_default} alt={pokemon?.name} style={{ height: 96, width: 96 }} />
      <p>Height: {pokemon?.height}</p>
      <p>Weight: {pokemon?.weight}</p>
    </li>
  );
};
