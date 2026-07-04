import { Book, BookStatus } from '@domain/book/Book';
import { CreateBookUseCaseInput } from '@domain/book/use-cases/create-book';
import { UpdateBookUseCaseInput } from '@domain/book/use-cases/update-book';

export interface BookRepository {
  create(params: CreateBookUseCaseInput): Promise<Book>;
  update(params: UpdateBookUseCaseInput): Promise<Book>;
  delete(id: number): Promise<void>;
  findMany(id: number): Promise<Book[] | null>;
  findById(id: number): Promise<Book | null>;
  toggleStatusTo(status: BookStatus, id: number): Promise<void>;
  setSoldAt(date: Date, id: number): Promise<void>;
}
