export interface PaginatedList<T> {
  count: number;
  pages: number;
  currentPage: number;
  pageSize: number;
  items: T[];
}
