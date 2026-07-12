import { Job } from 'bullmq';
import { SoldBookEmailParams } from '@domain/shared/QueueService';
import { BullWorker } from '@infrastructure/shared/workers/BullWorker';
import { EmailService } from '@domain/shared/EmailService';
import { UserRepository } from '@domain/user/repositories/UserRepository';

export class SoldBookEmailWorker extends BullWorker<SoldBookEmailParams> {
  private readonly emailService: EmailService;
  private readonly userRepository: UserRepository;

  constructor(emailService: EmailService, userRepository: UserRepository) {
    super('sold-book-email');
    this.emailService = emailService;
    this.userRepository = userRepository;
  }

  processJob = async (job: Job<SoldBookEmailParams>) => {
    const user = await this.userRepository.findBy({ id: job.data.ownerId });

    if (!user) {
      throw new Error(
        `User not found for sold book email: ownerId=${job.data.ownerId}`
      );
    }

    await this.emailService.send({
      email: user.email,
      subject: 'Sold book notification',
      message: `The book ${job.data.title} has been sold`,
    });
  };
}
