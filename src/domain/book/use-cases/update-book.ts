import { BookRepository } from '@domain/book/repositories/BookRepository';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';
import { ForbiddenOperationError } from '@domain/errors/ForbiddenOperationError';
import { Book } from '@prisma/client';

export interface UpdateBookUseCaseInput {
  id: number;
  ownerId: number;
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
    const product = await this.bookRepository.findById(input.id);
    // Buscar el libro a editar por Id
    if (!product) {
      throw new EntityNotFoundError('product', String(input.id));
    }

    if (input.ownerId !== product.ownerId) {
      throw new ForbiddenOperationError('User must own the book');
    }

    const updatedBook = this.bookRepository.update(input);
    return updatedBook;
  }
}
