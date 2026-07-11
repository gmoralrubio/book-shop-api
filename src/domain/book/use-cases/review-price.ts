import { BookRepository } from '@domain/book/repositories/BookRepository';
import { BusinessConflictError } from '@domain/errors/BusinessConflictError';
import { EntityNotFoundError } from '@domain/errors/EntityNotFoundError';
import { EmailService } from '@domain/shared/EmailService';
import { UserRepository } from '@domain/user/repositories/UserRepository';

export class ReviewPriceUseCase {
  readonly userRepository: UserRepository;
  readonly bookRepository: BookRepository;
  readonly emailService: EmailService;

  constructor(
    userRepository: UserRepository,
    bookRepository: BookRepository,
    emailService: EmailService
  ) {
    this.userRepository = userRepository;
    this.bookRepository = bookRepository;
    this.emailService = emailService;
  }

  async execute(): Promise<void> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const books = await this.bookRepository.findPublishedBefore(sevenDaysAgo);

    if (!books) {
      throw new BusinessConflictError(
        `No books founded published before ${sevenDaysAgo}`
      );
    }

    await Promise.allSettled(
      books.map(async (book) => {
        const owner = await this.userRepository.findBy({ id: book.ownerId });
        if (!owner) {
          throw new EntityNotFoundError('User', book.ownerId.toString());
        }
        await this.emailService.send({
          email: owner.email,
          subject: `Price review for product id ${book.id}`,
          message: `The product with id ${book.id} has been published since ${sevenDaysAgo}, we recommend a price reduction`,
        });
      })
    );
  }
}
