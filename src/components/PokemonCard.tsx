import { useEffect, useState, FC } from 'react';

import { PokemonType, PokemonCardProps } from '../types';
import { isOfType, isPokemon } from '../utils/helpers';

export const PokemonCard: FC<PokemonCardProps> = ({ id, onClick, baseURL }): JSX.Element => {
  const [pokemon, setPokemon] = useState<PokemonType>();

  useEffect(() => {
    const fetchPokemonByid = async (id: number) => {
      try {
        const response = await fetch(`${baseURL}/pokemon/${id}`);
        console.log(response);
        const data: unknown = await response.json();

        if (!isPokemon(data)) {
          throw new Error('Received data is not Pokemon type');
        }

        setPokemon(data);
      } catch (error) {
        console.error(error);
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
