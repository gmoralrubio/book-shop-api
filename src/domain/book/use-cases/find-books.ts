import { BookRepository } from '@domain/book/repositories/BookRepository';

export class FindBooksUseCase {
  readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(userId: number) {
    const books = await this.bookRepository.findMany(userId);
    return books;
  }
}
