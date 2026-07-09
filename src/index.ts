import { environmentService } from '@infraestructure/EnvironmentService';
import api from './api';
import { Job, Worker } from 'bullmq';
import { SoldBookEmailParams } from '@domain/shared/QueueService';
import { NodemailerEmailService } from '@infraestructure/shared/NodemailerEmailService';
import { PrismaUserRepository } from '@infraestructure/user/repositories/PrismaUserRepository';

environmentService.load();

const { PORT, REDIS_URL } = environmentService.get();

api.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const redisUrl = new URL(REDIS_URL);

const connection = {
  connection: {
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
  },
};

new Worker(
  'sold-book-email',
  async (job: Job<SoldBookEmailParams>) => {
    const emailService = new NodemailerEmailService();
    const userRepository = new PrismaUserRepository();

    try {
      const user = await userRepository.findById(Number(job.data.ownerId));

      await emailService.send({
        email: user?.email ?? '',
        message: `The book ${job.data.title} has been sold`,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error unknown');
      }
    }
  },
  connection
);
