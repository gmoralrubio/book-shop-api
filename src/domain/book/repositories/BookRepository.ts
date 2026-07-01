import { CreateBookUseCaseInput } from '@domain/book/use-cases/create-book';
import { Book } from '@prisma/client';

export interface BookRepository {
  create(params: CreateBookUseCaseInput): Promise<Book>;
}
