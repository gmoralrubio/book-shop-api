import { FindBooksResponse } from '@domain/book/types/FindBooksResponse';
import { BookRepository } from '@domain/book/repositories/BookRepository';
import { Pagination } from '@domain/shared/Pagination';
import { BookStatus } from '@domain/book/Book';

interface BookFilterQuery {
  userId?: number;
  search?: string;
  status?: BookStatus;
}

export type FindBooksUseCaseInput = Pagination & BookFilterQuery;

export class FindBooksUseCase {
  readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(criteria: FindBooksUseCaseInput): Promise<FindBooksResponse> {
    const { books, total } = await this.bookRepository.findMany(criteria);
    return {
      books,
      total,
    };
  }
}
