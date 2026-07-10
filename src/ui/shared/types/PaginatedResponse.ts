export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pages: number;
    per_page: number;
    total_items: number;
    urls: {
      first: string;
      prev: string;
      next: string;
      last: string;
    };
  };
}

export interface PaginatedResponseParams<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  url: string;
}
