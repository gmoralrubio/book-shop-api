import { BookRepository } from '@domain/book/repositories/BookRepository';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';
import { QueueService } from '@domain/shared/QueueService';

interface BuyBookUseCaseInput {
  id: number;
  userId: number;
}

export class BuyBookUseCase {
  readonly bookRepository: BookRepository;
  readonly queueService: QueueService;

  constructor(bookRepository: BookRepository, queueService: QueueService) {
    this.bookRepository = bookRepository;
    this.queueService = queueService;
  }

  async execute(input: BuyBookUseCaseInput) {
    const book = await this.bookRepository.findById(input.id);

    if (!book) {
      throw new EntityNotFoundError('book', String(input.id));
    }

    if (book.status === 'SOLD') {
      throw new BusinessConflictError(
        `Users cannot buy a book with ${book.status} status`
      );
    }

    if (input.userId === book.ownerId) {
      throw new BusinessConflictError('Users cannot buy their own books');
    }

    const now = new Date();

    await this.bookRepository.toggleStatusTo('SOLD', input.id);
    await this.bookRepository.setSoldAt(now, input.id);

    const soldBook = await this.bookRepository.findById(input.id);

    this.queueService.sendSoldBookEmail({
      ownerId: book.ownerId.toString(),
      title: book.title,
    });

    return soldBook;

    // TODO: ENVIO EMAIL AL VENDEDOR NOTIFICANDO VENTA
  }
}
