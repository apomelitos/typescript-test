import { PokemonType } from '../types';

export const getIdFromURL = (url: string): number => {
  const id = url.slice(0, -1).split('/').pop();

  if (typeof id === 'string') {
    return parseInt(id);
  }

  return 0;
};

export const isOfType = <T extends Record<string, unknown>>(obj: unknown, keys: Array<keyof T>): obj is T => {
  if (!obj || typeof obj !== 'object') return false;

  for (const key of keys) {
    if (typeof key !== 'string' || !(key in obj)) return false;
  }

  return true;
};

export const isArrayOfType = <T extends Record<string, unknown>>(
  value: unknown,
  keys: Array<keyof T>
): value is Array<T> => {
  if (!Array.isArray(value)) return false;

  return value.length === 0 || value.every((item) => isOfType<T>(item, keys));
};

export const isPokemon = (obj: unknown): obj is PokemonType => {
  return !!obj && typeof obj === 'object' && 'base_experience' in obj;
};
