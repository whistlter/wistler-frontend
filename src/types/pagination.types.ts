// src/types/pagination.ts
export type PaginatedUsers<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};