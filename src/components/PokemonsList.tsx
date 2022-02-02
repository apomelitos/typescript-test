import React, { useState, useEffect, FC } from 'react';
import { usePagination } from '../hooks/usePagination';
import { PokemonsListResponse, PokemonsListItem } from '../types';
import { PokemonCard } from './PokemonCard';
import { PokemonDetails } from './PokemonDetails';
import './PokemonsList.scss';

const baseURL = 'https://pokeapi.co/api/v2';

export const PokemonsList: FC = (): JSX.Element => {
  const [pokemons, setPokemons] = useState<PokemonsListResponse>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  const {
    totalPages: pageCount,
    nextPage,
    prevPage,
    setPage,
    page,
  } = usePagination({
    contentPerPage: 20,
    count: pokemons?.count,
  });
  ///
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);

  const getIdFromURL = (url: string): number => {
    const id = url.slice(0, -1).split('/').pop();

    if (typeof id === 'string') {
      return parseInt(id);
    }

    return 0;
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await fetch(`${baseURL}/pokemon?offset=${(page - 1) * 20}`);
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
      <button className='page-btn' onClick={prevPage}>
        Prev
      </button>
      {page !== 1 && (
        <button className='page-btn' onClick={() => setPage(1)}>
          1
        </button>
      )}
      <button className='page-btn' disabled>
        {page}
      </button>
      {page !== pageCount && (
        <button className='page-btn' onClick={() => setPage(pageCount)}>
          {pageCount}
        </button>
      )}
      <button className='page-btn' onClick={nextPage}>
        Next
      </button>
      {selectedPokemonId && <PokemonDetails id={selectedPokemonId} baseURL={baseURL} />}
    </>
  );
};
