import React, { useState, useEffect, FC } from 'react';
import { PokemonsListResponse, PokemonsListItem } from '../types';
import { PokemonCard } from './PokemonCard';
import { PokemonDetails } from './PokemonDetails';
import './PokemonsList.scss';

const baseURL = 'https://pokeapi.co/api/v2';

export const PokemonsList: FC = (): JSX.Element => {
  const [pokemons, setPokemons] = useState<PokemonsListResponse>();
  const [page, setPage] = useState(0);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);

  const getIdFromURL = (url: string): number => {
    const id = url.slice(0, -1).split('/').pop();

    if (typeof id === 'string') {
      return parseInt(id);
    }

    return 0;
  };

  const prevPageClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (pokemons?.previous) {
      setPage((prev) => prev - 1);
    }
  };

  const nextPageClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (pokemons?.next) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await fetch(`${baseURL}/pokemon?offset=${page * 20}`);
      console.log(response);
      const data: PokemonsListResponse = (await response.json()) as PokemonsListResponse;
      setPokemons(data);
    };

    fetchPokemons();
  }, [page]);

  return (
    <>
      <ul className='pokemons'>
        {pokemons &&
          pokemons.results.map((item: PokemonsListItem) => {
            const id = getIdFromURL(item.url);
            return <PokemonCard baseURL={baseURL} key={id} id={id} onClick={(id) => setSelectedPokemonId(id)} />;
          })}
      </ul>
      <button className='page-btn' onClick={prevPageClickHandler}>
        Prev
      </button>
      <button className='page-btn' onClick={nextPageClickHandler}>
        Next
      </button>
      {selectedPokemonId && <PokemonDetails id={selectedPokemonId} baseURL={baseURL} />}
    </>
  );
};
