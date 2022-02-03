import { useState, useEffect, FC } from 'react';
import { usePagination } from '../hooks/usePagination';
import { getIdFromURL } from '../utils/helpers';
import { PokemonsListResponse, PokemonsListItem } from '../types';
import { PokemonCard } from './PokemonCard';
import { PokemonDetails } from './PokemonDetails';
import './PokemonsList.scss';

const baseURL = 'https://pokeapi.co/api/v2';

const isPokemonListResponse = (obj: unknown): obj is PokemonsListResponse => {
  return !!obj && typeof obj === 'object' && 'results' in obj;
};

const isPokemonsListItem = (obj: unknown): obj is PokemonsListItem => {
  return !!obj && typeof obj === 'object' && 'url' in obj && 'name' in obj;
};

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

  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await fetch(`${baseURL}/pokemon?offset=${(page - 1) * 20}`);
      const data: unknown = await response.json();

      if (!isPokemonListResponse(data) || !Array.isArray(data.results) || !data.results.every(isPokemonsListItem)) {
        throw new Error('Received data is not PokemonsListResponse type');
      }

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
