export const getIdFromURL = (url: string): number => {
  const id = url.slice(0, -1).split('/').pop();

  if (typeof id === 'string') {
    return parseInt(id);
  }

  return 0;
};
