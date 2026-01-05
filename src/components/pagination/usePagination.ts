// src/components/pagination/usePagination.ts
export const DOTS = "dots" as const;

type PaginationItem = number | typeof DOTS;

interface UsePaginationProps {
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
}

export function usePagination({
  totalPages,
  currentPage,
  siblingCount = 1,
}: UsePaginationProps): PaginationItem[] {
  // Guard against NaN or invalid totalPages
  if (isNaN(totalPages) || totalPages <= 0) {
    return [];
  }

  // If total pages can fit without dots, show all pages
  const totalPageNumbers = siblingCount * 2 + 5; // first + left siblings + current + right siblings + last

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  // No dots on left, show dots on right
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, DOTS, lastPageIndex];
  }

  // No dots on right, show dots on left
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + 1 + i
    );
    return [firstPageIndex, DOTS, ...rightRange];
  }

  // Show dots on both sides
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
}