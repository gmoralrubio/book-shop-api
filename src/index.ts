import api from './api';
import { environmentService } from '@infrastructure/shared/services/EnvironmentService';
import { SoldBookEmailWorker } from '@infrastructure/shared/workers/SoldBookEmailWorker';
import { NodemailerEmailService } from '@infrastructure/shared/services/NodemailerEmailService';
import { PrismaUserRepository } from '@infrastructure/user/repositories/PrismaUserRepository';
import { PrismaBookRepository } from '@infrastructure/book/repositories/PrismaBookRepository';
import { ReviewPriceEmailWorker } from '@infrastructure/shared/workers/ReviewPriceEmailWorker';
import { BullQueueService } from '@infrastructure/shared/services/BullQueueService';

environmentService.load();

const { PORT } = environmentService.get();

api.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const emailService = new NodemailerEmailService();
const userRepository = new PrismaUserRepository();
const bookRepository = new PrismaBookRepository();
const bullQueueService = new BullQueueService();

new SoldBookEmailWorker(emailService, userRepository);
new ReviewPriceEmailWorker(bookRepository, userRepository, emailService);

bullQueueService.priceReviewCron();
