import { Book, BookStatus } from '@domain/book/Book';
import { CreateBookUseCaseInput } from '@domain/book/use-cases/create-book';
import {
  FindBooksUseCaseInput,
  FindBooksUseCaseResponse,
} from '@domain/book/use-cases/find-books';
import { UpdateBookUseCaseInput } from '@domain/book/use-cases/update-book';

export interface BookRepository {
  create(params: CreateBookUseCaseInput): Promise<Book>;
  update(params: UpdateBookUseCaseInput): Promise<Book>;
  delete(id: number): Promise<void>;
  findMany(criteria: FindBooksUseCaseInput): Promise<FindBooksUseCaseResponse>;
  findById(id: number): Promise<Book | null>;
  toggleStatusTo(status: BookStatus, id: number): Promise<void>;
  setSoldAt(date: Date, id: number): Promise<void>;
}
