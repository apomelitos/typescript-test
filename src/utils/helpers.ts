export const getIdFromURL = (url: string): number => {
  const id = url.slice(0, -1).split('/').pop();

  if (typeof id === 'string') {
    return parseInt(id);
  }

  return 0;
};

export const isTypeOf = <T extends Record<string, unknown>>(value: unknown, key: keyof T): value is T => {
  return value instanceof Object && key in value;
};

export const isArrayOf = <T extends Record<string, unknown>>(value: unknown, key: keyof T): value is Array<T> => {
  if (!(value instanceof Array)) return false;

  return value.length === 0 || isTypeOf<T>(value[0], key);
};
