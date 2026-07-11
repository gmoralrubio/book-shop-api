import api from './api';
import { environmentService } from '@infraestructure/shared/services/EnvironmentService';
import { SoldBookEmailWorker } from '@infraestructure/shared/workers/SoldBookEmailWorker';
import { NodemailerEmailService } from '@infraestructure/shared/services/NodemailerEmailService';
import { PrismaUserRepository } from '@infraestructure/user/repositories/PrismaUserRepository';
import { PrismaBookRepository } from '@infraestructure/book/repositories/PrismaBookRepository';
import { ReviewPriceEmailWorker } from '@infraestructure/shared/workers/ReviewPriceEmailWorker';
import { BullQueueService } from '@infraestructure/shared/services/BullQueueService';

environmentService.load();

const { PORT } = environmentService.get();

api.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const emailService = new NodemailerEmailService();
const userRepository = new PrismaUserRepository();
const bookRepository = new PrismaBookRepository();

new SoldBookEmailWorker(emailService, userRepository);
new ReviewPriceEmailWorker(emailService, userRepository, bookRepository);

const bullQueueService = new BullQueueService();
bullQueueService.priceReviewCron();
