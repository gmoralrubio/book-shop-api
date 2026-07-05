import { BookRepository } from '@domain/book/repositories/BookRepository';
import { Pagination } from '@domain/shared/Pagination';
import { Book } from '@prisma/client';

interface BookFilterQuery {
  userId?: number;
}
export interface FindBooksUseCaseResponse {
  books: Book[];
  total: number;
}

export type FindBooksUseCaseInput = Pagination & BookFilterQuery;

export class FindBooksUseCase {
  readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(
    criteria: FindBooksUseCaseInput
  ): Promise<FindBooksUseCaseResponse> {
    const { books, total } = await this.bookRepository.findMany(criteria);
    return {
      books,
      total,
    };
  }
}
