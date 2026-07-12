import { ReviewPriceEmailParams } from '@domain/shared/QueueService';
import { BullWorker } from '@infrastructure/shared/workers/BullWorker';
import { EmailService } from '@domain/shared/EmailService';
import { UserRepository } from '@domain/user/repositories/UserRepository';
import { BookRepository } from '@domain/book/repositories/BookRepository';
import { ReviewPriceUseCase } from '@domain/book/use-cases/review-price';

export class ReviewPriceEmailWorker extends BullWorker<ReviewPriceEmailParams> {
  private readonly emailService: EmailService;
  private readonly userRepository: UserRepository;
  private readonly bookRepository: BookRepository;

  constructor(
    emailService: EmailService,
    userRepository: UserRepository,
    bookRepository: BookRepository
  ) {
    super('price-review-email-cron');
    this.emailService = emailService;
    this.userRepository = userRepository;
    this.bookRepository = bookRepository;
  }

  processJob = async () => {
    // Delega a use case
    const reviewPriceUseCase = new ReviewPriceUseCase(
      this.userRepository,
      this.bookRepository,
      this.emailService
    );
    await reviewPriceUseCase.execute();
  };
}
