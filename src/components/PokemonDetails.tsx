import { FC, useState, useEffect } from 'react';
import { PokemonType, PokemonDetailsProps } from '../types';
import { isOfType } from '../utils/helpers';
import { EvolutionList } from './EvolutionsList';
import './PokemonDetails.scss';

export const isPokemon = (obj: unknown): obj is PokemonType => {
  return !!obj && typeof obj === 'object' && 'base_experience' in obj;
};

export const PokemonDetails: FC<PokemonDetailsProps> = ({ id, baseURL }): JSX.Element => {
  const [pokemon, setPokemon] = useState<PokemonType>();

  useEffect(() => {
    const fetchPokemonById = async (id: number) => {
      try {
        const response = await fetch(`${baseURL}/pokemon/${id.toString()}`);
        const data: unknown = await response.json();

        if (!isPokemon(data)) {
          throw new Error('Received data is not Pokemon type');
        }

        setPokemon(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPokemonById(id);
  }, [id, baseURL]);

  return (
    <div className='pokemon-details'>
      <h2>{pokemon?.name}</h2>
      <div className='img-wrapper'>
        <img src={pokemon?.sprites.front_default} alt={pokemon?.name} />
      </div>
      <div>
        <p>Weight: {pokemon?.weight}</p>
        <p>Height: {pokemon?.height}</p>
        <p>Base experience: {pokemon?.base_experience}</p>
      </div>
      {pokemon && <EvolutionList pokemonSpeciesURL={pokemon?.species?.url} />}
    </div>
  );
};
