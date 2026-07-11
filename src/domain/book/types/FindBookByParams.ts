import { BookStatus } from '@domain/book/Book';

export interface FindBookByParams {
  id?: number;
  status?: BookStatus;
}
