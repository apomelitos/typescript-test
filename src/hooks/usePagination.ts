import { useState } from 'react';

type UsePaginationProps = {
  contentPerPage: number;
  count: number;
};

type UsePaginationReturn = {
  page: number;
  totalPages: number;
  firstContentIndex: number;
  lastContentIndex: number;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (newPage: number) => void;
};

export const usePagination = ({ contentPerPage, count }: UsePaginationProps): UsePaginationReturn => {
  const [page, setPage] = useState<number>(1);

  const pageCount = Math.ceil(count / contentPerPage);

  const lastContentIndex = page * contentPerPage;
  const firstContentIndex = lastContentIndex - contentPerPage;

  const changePage = (direction: boolean) => {
    setPage((prevPage) => {
      if (direction) {
        return prevPage === pageCount ? prevPage : prevPage + 1;
      } else {
        return prevPage === 1 ? prevPage : prevPage - 1;
      }
    });
  };

  const setPageSafe = (newPage: number) => {
    if (newPage > pageCount) {
      setPage(pageCount);
    } else if (newPage < 1) {
      setPage(1);
    } else {
      setPage(newPage);
    }
  };

  return {
    totalPages: pageCount,
    nextPage: () => changePage(true),
    prevPage: () => changePage(false),
    setPage: setPageSafe,
    firstContentIndex,
    lastContentIndex,
    page,
  };
};
