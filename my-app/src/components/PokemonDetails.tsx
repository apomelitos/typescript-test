import { FC, useState, useEffect } from 'react';
import { PokemonType, PokemonDetailsProps } from '../types';
import { EvolutionList } from './EvolutionsList';
import './PokemonDetails.scss';

export const PokemonDetails: FC<PokemonDetailsProps> = ({ id, baseURL }): JSX.Element => {
  const [pokemon, setPokemon] = useState<PokemonType>();

  useEffect(() => {
    const fetchPokemonById = async (id: number) => {
      const response = await fetch(`${baseURL}/pokemon/${id.toString()}`);
      const data = (await response.json()) as PokemonType;
      setPokemon(data);
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
