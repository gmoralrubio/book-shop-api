import { Job, Worker } from 'bullmq';
import { SoldBookEmailParams } from '@domain/shared/QueueService';
import { BullQueueService } from '@infraestructure/shared/BullQueueService';
import { NodemailerEmailService } from '@infraestructure/shared/NodemailerEmailService';
import { PrismaUserRepository } from '@infraestructure/user/repositories/PrismaUserRepository';

export class SoldBookEmailWorker {
  private readonly worker: Worker;
  constructor() {
    this.worker = new Worker('sold-book-email', this.processJob, {
      autorun: false,
      connection: BullQueueService.getRedisConnection(),
    });
  }

  private processJob = async (job: Job<SoldBookEmailParams>) => {
    try {
      const emailService = new NodemailerEmailService();
      const userRepository = new PrismaUserRepository();
      const user = await userRepository.findById(job.data.ownerId);

      if (!user) {
        throw new Error(
          `User not found for sold book email: ownerId=${job.data.ownerId}`
        );
      }

      await emailService.send({
        email: user.email,
        message: `The book ${job.data.title} has been sold`,
      });
    } catch (error) {
      console.error(`SoldBookEmailWorker job ${job.id} failed:`, error);
      throw error;
    }
  };

  run() {
    this.worker.run();
  }
}
