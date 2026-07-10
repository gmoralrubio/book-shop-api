import {
  PaginatedResponse,
  PaginatedResponseParams,
} from '@ui/shared/types/PaginatedResponse';

export const buildPaginatedResponse = <T>(
  params: PaginatedResponseParams<T>
): PaginatedResponse<T> => {
  const pages = Math.max(1, Math.ceil(params.total / params.limit));
  const prevPage = params.page === 1 ? params.page : params.page - 1;
  const nextPage = params.page === pages ? pages : params.page + 1;

  return {
    data: params.data,
    meta: {
      page: params.page,
      pages,
      total_items: params.total,
      per_page: params.limit,
      urls: {
        first: `${params.url}?page=1&limit=${params.limit}`,
        prev: `${params.url}?page=${prevPage}&limit=${params.limit}`,
        next: `${params.url}?page=${nextPage}&limit=${params.limit}`,
        last: `${params.url}?page=${pages}&limit=${params.limit}`,
      },
    },
  };
};
