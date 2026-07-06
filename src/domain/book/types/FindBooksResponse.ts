import { Book } from '@domain/book/Book';

export interface FindBooksResponse {
  books: Book[];
  total: number;
}
