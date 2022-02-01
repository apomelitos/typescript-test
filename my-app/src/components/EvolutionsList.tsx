import { FC, useCallback, useEffect, useState } from 'react';
import { PokemonType } from '../types';
import './EvolutionsList.scss';

type EvolutionChain = {
  evolution_details: { min_happiness: number }[];
  evolves_to: EvolutionChain[] | [];
  is_baby: boolean;
  species: { name: string; url: string };
  sprite?: string;
};

type EvolutionsListProps = {
  pokemonSpeciesURL: string;
};

export const EvolutionList: FC<EvolutionsListProps> = ({ pokemonSpeciesURL }) => {
  const [evolutions, setEvolutions] = useState<EvolutionChain[]>();

  const getArrayFromRecursiveObject = (obj: EvolutionChain): Array<EvolutionChain> => {
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

  const fetchPokemonSpriteByName = async (name: string): Promise<string> => {
    let url = '';

    try {
      const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const {
        sprites: { front_default },
      } = (await resp.json()) as PokemonType;
      url = front_default;
    } catch (err) {
      console.error(err);
    }

    return url;
  };

  const fetchEvolutions = useCallback(async () => {
    const speciesResponse = await fetch(pokemonSpeciesURL);
    const {
      evolution_chain: { url },
    } = (await speciesResponse.json()) as { evolution_chain: { url: string } };

    const evolutionResponse = await fetch(url);
    const { chain } = (await evolutionResponse.json()) as { chain: EvolutionChain };

    const evolutionsList = getArrayFromRecursiveObject(chain);
    console.log(evolutionsList);
    console.log(chain);
    for (let evolIdx = 0; evolIdx < evolutionsList.length; evolIdx++) {
      const name = evolutionsList[evolIdx].species.name;
      evolutionsList[evolIdx].sprite = await fetchPokemonSpriteByName(name);
    }

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
