import { QueueService, SoldBookEmailParams } from '@domain/shared/QueueService';
import { environmentService } from '@infraestructure/EnvironmentService';
import { Queue } from 'bullmq';

export class BullQueueService implements QueueService {
  private readonly soldBookEmailQueue: Queue;

  constructor() {
    const { REDIS_URL } = environmentService.get();
    const redisUrl = new URL(REDIS_URL);

    const connection = {
      connection: {
        host: redisUrl.hostname,
        port: Number(redisUrl.port),
      },
    };
    this.soldBookEmailQueue = new Queue('sold-book-email', connection);
  }
  async sendSoldBookEmail(params: SoldBookEmailParams): Promise<void> {
    await this.soldBookEmailQueue.add('sold-book-email-job', params);
  }
}
