import { Job, Worker } from 'bullmq';
import { BullQueueService } from '@infraestructure/shared/services/BullQueueService';

export abstract class BullWorker<TJobData> {
  readonly worker: Worker<TJobData>;

  constructor(queueName: string) {
    this.worker = new Worker(queueName, (job) => this.processJob(job), {
      connection: BullQueueService.getRedisConnection(),
    });
    this.worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed: ${err.message}`);
    });
  }

  abstract processJob(job: Job<TJobData>): Promise<void>;
}
