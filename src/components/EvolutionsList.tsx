import { FC, useCallback, useEffect, useState } from 'react';
import { getIdFromURL } from '../utils/helpers';
import { PokemonType, EvolutionChain, EvolutionsListProps } from '../types';
import './EvolutionsList.scss';

type SpecieType = {
  evolution_chain: { url: string };
};

type EvolutionChainResponse = {
  chain: EvolutionChain;
};

const fetchPokemonSpritesByName = async (URLs: string[]): Promise<string[]> => {
  try {
    const promises = URLs.map((url) => fetch(url));
    const responses = await Promise.all(promises);
    const jsonPromises = responses.map((resp) => resp.json());
    const pokemons = (await Promise.all(jsonPromises)) as PokemonType[];

    return pokemons.map((pokemon) => pokemon.sprites.front_default);
  } catch (err) {
    console.error(err);
  }

  return [];
};

export const EvolutionList: FC<EvolutionsListProps> = ({ pokemonSpeciesURL }) => {
  const [evolutions, setEvolutions] = useState<EvolutionChain[]>();

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

  const fetchEvolutions = useCallback(async () => {
    const speciesResponse = await fetch(pokemonSpeciesURL);

    if (speciesResponse.ok) {
      const { evolution_chain } = (await speciesResponse.json()) as SpecieType;
      const evolutionResponse = await fetch(evolution_chain.url);

      if (evolutionResponse.ok) {
        const { chain } = (await evolutionResponse.json()) as EvolutionChainResponse;
        const evolutionsList = getArrayFromRecursiveObject(chain);
        const urls: string[] = evolutionsList.map((item) => `https://pokeapi.co/api/v2/pokemon/${item.species.name}`);
        const sprites: string[] = await fetchPokemonSpritesByName(urls);

        evolutionsList.forEach((item, index, arr) => (arr[index].sprite = sprites[index]));

        setEvolutions(evolutionsList);
      }
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
