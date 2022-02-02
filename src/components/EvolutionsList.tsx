import { FC, useCallback, useEffect, useState } from 'react';
import { PokemonType, EvolutionChain, EvolutionsListProps } from '../types';
import './EvolutionsList.scss';

export const EvolutionList: FC<EvolutionsListProps> = ({ pokemonSpeciesURL }) => {
  const [evolutions, setEvolutions] = useState<EvolutionChain[]>();

  const getArrayFromRecursiveObject = (obj: EvolutionChain): EvolutionChain[] => {
    const arr: Array<EvolutionChain> = [];

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

  const fetchEvolutions = useCallback(async () => {
    const speciesResponse = await fetch(pokemonSpeciesURL);
    const {
      evolution_chain: { url },
    } = (await speciesResponse.json()) as { evolution_chain: { url: string } };

    const evolutionResponse = await fetch(url);
    const { chain } = (await evolutionResponse.json()) as { chain: EvolutionChain };

    const evolutionsList = getArrayFromRecursiveObject(chain);

    const urls: string[] = evolutionsList.map((item) => `https://pokeapi.co/api/v2/pokemon/${item.species.name}`);
    const sprites: string[] = await fetchPokemonSpritesByName(urls);

    evolutionsList.forEach((item, index, arr) => (arr[index].sprite = sprites[index]));

    setEvolutions(evolutionsList);
  }, [pokemonSpeciesURL]);

  useEffect(() => {
    fetchEvolutions();
  }, [fetchEvolutions]);

  return (
    <ul className='evolution-chain'>
      {evolutions &&
        evolutions.map((item, idx) => (
          <li key={idx}>
            <h4>
              {item.species.name} {item.is_baby ? '(baby)' : ''}
            </h4>
            <img src={item.sprite} alt={`${item.species.name} image`} />
          </li>
        ))}
    </ul>
  );
};
