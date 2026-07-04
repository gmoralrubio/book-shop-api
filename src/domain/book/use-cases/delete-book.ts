import { BookRepository } from '@domain/book/repositories/BookRepository';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';
import { ForbiddenOperationError } from '@domain/errors/ForbiddenOperationError';

export interface DeleteBookUseCaseInput {
  id: number;
  userId: number;
}

export class DeleteBookUseCase {
  readonly bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(input: DeleteBookUseCaseInput) {
    const book = await this.bookRepository.findById(input.id);

    if (!book) {
      throw new EntityNotFoundError('Book', String(input.id));
    }

    if (book.ownerId !== input.userId) {
      throw new ForbiddenOperationError('User does not owns the product');
    }

    if (book.status === 'SOLD') {
      throw new BusinessConflictError(
        `Book status is ${book.status}, cannot be deleted`
      );
    }

    await this.bookRepository.delete(input.id);
  }
}
