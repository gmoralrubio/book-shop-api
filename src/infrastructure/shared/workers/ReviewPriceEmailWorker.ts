import { BullWorker } from '@infrastructure/shared/workers/BullWorker';
import { BookRepository } from '@domain/book/repositories/BookRepository';
import { EmailService } from '@domain/shared/EmailService';
import { UserRepository } from '@domain/user/repositories/UserRepository';

export class ReviewPriceEmailWorker extends BullWorker<void> {
  private readonly bookRepository: BookRepository;
  private readonly userRepository: UserRepository;
  private readonly emailService: EmailService;

  constructor(
    bookRepository: BookRepository,
    userRepository: UserRepository,
    emailService: EmailService
  ) {
    super('price-review-email-cron');
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  processJob = async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const books = await this.bookRepository.findPublishedBefore(sevenDaysAgo);

    if (!books) return;

    for (const book of books) {
      try {
        const owner = await this.userRepository.findBy({ id: book.ownerId });

        if (!owner) {
          console.error(`Owner not found for book ${book.id}`);
          continue;
        }

        await this.emailService.send({
          email: owner.email,
          subject: `Price review for "${book.title}"`,
          message: `The book "${book.title}" (id: ${book.id}) has been published for over 7 days. Consider a price reduction.`,
        });
      } catch (error) {
        console.error(
          `Error sending review email for book ${book.id}: ${error}`
        );
      }
    }
  };
}
