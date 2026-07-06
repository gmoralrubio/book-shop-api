import { FindBooksResponse } from '@domain/book/types/FindBooksResponse';
import { BookRepository } from '@domain/book/repositories/BookRepository';
import { Pagination } from '@domain/shared/Pagination';

interface BookMeFilterQuery {
  userId?: number;
}

export type FindBooksMeUseCaseInput = Pagination & BookMeFilterQuery;

export class FindBooksMeUseCase {
  readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(criteria: FindBooksMeUseCaseInput): Promise<FindBooksResponse> {
    const { books, total } = await this.bookRepository.findMany(criteria);
    return {
      books,
      total,
    };
  }
}
