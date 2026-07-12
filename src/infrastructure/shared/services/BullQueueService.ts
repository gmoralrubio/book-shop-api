import { QueueService, SoldBookEmailParams } from '@domain/shared/QueueService';
import { environmentService } from '@infrastructure/shared/services/EnvironmentService';
import { Queue } from 'bullmq';

export class BullQueueService implements QueueService {
  private readonly soldBookEmailQueue: Queue;
  private readonly priceReviewCronQueue: Queue;
  constructor() {
    this.soldBookEmailQueue = this.createQueue('sold-book-email');
    this.priceReviewCronQueue = this.createQueue('price-review-email-cron');
  }

  private createQueue(name: string) {
    return new Queue(name, {
      connection: BullQueueService.getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: 1000,
        removeOnFail: 5000,
      },
    });
  }

  static getRedisConnection() {
    const { REDIS_URL } = environmentService.get();
    const redisUrl = new URL(REDIS_URL);
    return {
      host: redisUrl.hostname,
      port: Number(redisUrl.port),
    };
  }

  async sendSoldBookEmail(params: SoldBookEmailParams): Promise<void> {
    await this.soldBookEmailQueue.add('sold-book-email-job', params);
  }

  async priceReviewCron(): Promise<void> {
    await this.priceReviewCronQueue.upsertJobScheduler(
      'price-review-email-cron-job',
      // At 08:00 on Monday
      { pattern: '0 8 * * 1' },
      {
        name: 'price-review-email-job',
      }
    );
  }
}
