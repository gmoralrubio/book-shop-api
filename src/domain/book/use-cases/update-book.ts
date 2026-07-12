import { Book } from '@domain/book/Book';
import { BookRepository } from '@domain/book/repositories/BookRepository';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';
import { ForbiddenOperationError } from '@domain/errors/ForbiddenOperationError';

export interface UpdateBookUseCaseInput {
  id: number;
  userId: number;
  title?: string;
  description?: string;
  price?: number;
  author?: string;
}

export class UpdateBookUseCase {
  private readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(input: UpdateBookUseCaseInput): Promise<Book> {
    const book = await this.bookRepository.findById(input.id);

    if (!book) {
      throw new EntityNotFoundError('Book', String(input.id));
    }

    if (input.userId !== book.ownerId) {
      throw new ForbiddenOperationError('User must own the book');
    }

    const updatedBook = await this.bookRepository.update(input);
    return updatedBook;
  }
}
