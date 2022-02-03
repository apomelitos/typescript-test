import { FC } from 'react';
import { PokemonsList } from './components/PokemonsList';
import './App.css';

export const App: FC = (): JSX.Element => {
  return (
    <div className='App'>
      <PokemonsList />
    </div>
  );
};
