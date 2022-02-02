import { FC } from 'react';
import { usePagination } from '../hooks/usePagination';

type PaginationProps = {
  siblingCount: number;
  totalCount: number;
  pageSize: number;
  currentPage: number;
};

export const Pagination: FC<PaginationProps> = ({ siblingCount = 1, totalCount, pageSize, currentPage }) => {
  // const shouldShowRightDots = false;
  // const shouldShowLeftDots = false;

  const {
    totalPages: pageCount,
    nextPage,
    prevPage,
    setPage,
    firstContentIndex,
    lastContentIndex,
    page,
  } = usePagination({
    contentPerPage: pageSize,
    count: totalCount,
  });

  // const totalPages = Math.ceil(totalCount / pageSize);
  // const pagesToShow = 2 + siblingCount * 2 + 1;

  //   const getRange = (size: number, start: number): number[] => {
  //       const arr = [];
  //       for(let  = )
  //     return Array(size).keys().map((num) => num + start)
  //   }

  //   if (totalPages <= pagesToShow) {

  //   }

  //   if (t)

  return (
    <ul>
      <button className='page-btn' onClick={prevPage}>
        Prev
      </button>
      {page !== 1 && (
        <button className='page-btn' onClick={() => setPage(1)}>
          1
        </button>
      )}
      <button className='page-btn' disabled>
        {currentPage}
      </button>
      {page !== pageCount && (
        <button className='page-btn' onClick={() => setPage(pageCount)}>
          {pageCount}
        </button>
      )}
      <button className='page-btn' onClick={nextPage}>
        Next
      </button>
    </ul>
  );
};
