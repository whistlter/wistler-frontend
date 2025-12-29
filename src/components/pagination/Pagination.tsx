// src/components/pagination/Pagination.tsx
import clsx from "clsx";
import { usePagination, DOTS } from "./usePagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const pages = usePagination({
    totalPages,
    currentPage,
    siblingCount,
  });

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav className="flex items-center justify-between md:justify-center gap-2 w-full mb-6" aria-label="Pagination">
      {/* Previous Button */}
      <button
        type="button"
        disabled={isFirstPage}
        onClick={handlePrevious}
        className="rounded-[10px] cursor-pointer bg-white border border-gray-200 px-3 md:px-5 py-1.5 text-sm text-gray-600 transition-opacity hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        <span className="hidden sm:inline">Prev</span>
        <span className="sm:hidden">‹</span>
      </button>

      {/* Page Numbers - Hidden on mobile, visible on tablet+ */}
      <div className="hidden sm:flex items-center gap-2">
        {pages.map((page, index) =>
          page === DOTS ? (
            <span
              key={`${DOTS}-${index}`}
              className="flex h-9 w-11 items-center justify-center text-sm text-gray-400"
              aria-hidden="true"
            >
              ....
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => handlePageClick(page as number)}
              className={clsx(
                "h-9 w-11 rounded-[15px] text-sm font-medium transition-colors cursor-pointer flex items-center justify-center",
                page === currentPage
                  ? "bg-pink-500 text-white shadow-md cursor-default"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              )}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Mobile Page Indicator */}
      <div className="sm:hidden flex items-center justify-center">
        <span className="text-sm text-gray-600 font-medium">
          {currentPage} / {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={isLastPage}
        onClick={handleNext}
        className="rounded-[10px] cursor-pointer bg-white border border-gray-200 px-3 md:px-5 py-1.5 text-sm text-gray-600 transition-opacity hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">›</span>
      </button>
    </nav>
  );
}