import { FC, useCallback, useEffect, useState } from 'react';
import { getIdFromURL, isOfType, isArrayOfType, isPokemon } from '../utils/helpers';
import { EvolutionChain, EvolutionsListProps, SpecieType, EvolutionChainResponse } from '../types';
import './EvolutionsList.scss';

const isSpecie = (obj: unknown): obj is SpecieType => {
  return !!obj && typeof obj === 'object' && 'evolution_chain' in obj;
};

const isEvolutionChainResponse = (obj: unknown): obj is EvolutionChainResponse => {
  return !!obj && typeof obj === 'object' && 'chain' in obj;
};

const fetchPokemonSpritesByName = async (URLs: string[]): Promise<string[]> => {
  try {
    const promises = URLs.map((url) => fetch(url));
    const responses = await Promise.all(promises);
    const jsonPromises = responses.map((resp) => resp.json());
    const pokemons: unknown = await Promise.all(jsonPromises);

    if (!Array.isArray(pokemons) || !pokemons.every(isPokemon)) {
      throw Error('something unusual');
    }

    return pokemons.map((pokemon) => pokemon.sprites.front_default);
  } catch (err) {
    console.error(err);
  }

  return [];
};

const getArrayFromRecursiveObject = (obj: EvolutionChain): EvolutionChain[] => {
  const arr: EvolutionChain[] = [];

  let currentEvolution: EvolutionChain = obj;

  while (currentEvolution.evolves_to.length && 'evolves_to' in currentEvolution.evolves_to[0]) {
    arr.push({
      ...currentEvolution,
      evolves_to: [],
    });
    currentEvolution = currentEvolution.evolves_to[0];
  }

  arr.push({
    ...currentEvolution,
    evolves_to: [],
  });

  return arr;
};

export const EvolutionList: FC<EvolutionsListProps> = ({ pokemonSpeciesURL }) => {
  const [evolutions, setEvolutions] = useState<EvolutionChain[]>();

  const fetchEvolutions = useCallback(async () => {
    try {
      const speciesResponse = await fetch(pokemonSpeciesURL);

      if (speciesResponse.ok) {
        const specie: unknown = await speciesResponse.json();

        if (!isSpecie(specie)) {
          throw new Error('Received data is not Specie type');
        }

        const evolutionResponse = await fetch(specie.evolution_chain.url);

        if (evolutionResponse.ok) {
          const evolutionChain: unknown = await evolutionResponse.json();

          if (!isEvolutionChainResponse(evolutionChain)) {
            throw new Error('Received data is not EvolutionChainResponse type');
          }

          const evolutionsList = getArrayFromRecursiveObject(evolutionChain.chain);
          const urls: string[] = evolutionsList.map((item) => `https://pokeapi.co/api/v2/pokemon/${item.species.name}`);
          const sprites: string[] = await fetchPokemonSpritesByName(urls);

          evolutionsList.forEach((item, index, arr) => (arr[index].sprite = sprites[index]));

          setEvolutions(evolutionsList);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [pokemonSpeciesURL]);

  useEffect(() => {
    fetchEvolutions();
  }, [fetchEvolutions]);

  return (
    <ul className='evolution-chain'>
      {evolutions &&
        evolutions.map((item) => (
          <li key={item.sprite && getIdFromURL(item.sprite)}>
            <h4>
              {item.species.name} {item.is_baby ? '(baby)' : ''}
            </h4>
            <img src={item.sprite} alt={`${item.species.name} image`} />
          </li>
        ))}
    </ul>
  );
};
