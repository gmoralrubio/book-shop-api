import { CreateBookUseCaseInput } from '@domain/book/use-cases/create-book';
import { UpdateBookUseCaseInput } from '@domain/book/use-cases/update-book';
import { Book } from '@prisma/client';

export interface BookRepository {
  create(params: CreateBookUseCaseInput): Promise<Book>;
  update(params: UpdateBookUseCaseInput): Promise<Book>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Book | null>;
}
