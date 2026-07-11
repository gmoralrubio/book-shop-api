import { Book, BookStatus } from '@domain/book/Book';
import { FindBooksResponse } from '@domain/book/types/FindBooksResponse';
import { FindBookByParams } from '@domain/book/types/FindBookByParams';
import { CreateBookUseCaseInput } from '@domain/book/use-cases/create-book';
import { FindBooksUseCaseInput } from '@domain/book/use-cases/find-books';
import { UpdateBookUseCaseInput } from '@domain/book/use-cases/update-book';

export interface BookRepository {
  create(params: CreateBookUseCaseInput): Promise<Book>;
  update(params: UpdateBookUseCaseInput): Promise<Book>;
  delete(id: number): Promise<void>;
  findMany(criteria: FindBooksUseCaseInput): Promise<FindBooksResponse>;
  findBy(params: FindBookByParams): Promise<Book | null>;
  toggleStatusTo(status: BookStatus, id: number): Promise<void>;
  setSoldAt(date: Date, id: number): Promise<void>;
}
