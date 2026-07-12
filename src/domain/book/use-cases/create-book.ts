import { Book } from '@domain/book/Book';
import { BookRepository } from '@domain/book/repositories/BookRepository';

export interface CreateBookUseCaseInput {
  ownerId: number;
  title: string;
  description: string;
  price: number;
  author: string;
}

export class CreateBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(input: CreateBookUseCaseInput): Promise<Book> {
    const book = await this.bookRepository.create(input);
    return book;
  }
}
