export type PaginationWrapper<T> = {
  data: T;
  length: number;
  page: number;
  limit: number;
  lastPage: number;
};
