import { environmentService } from '@infraestructure/shared/services/EnvironmentService';
import api from './api';

import { SoldBookEmailWorker } from '@infraestructure/shared/workers/SoldBookEmailWorker';
import { NodemailerEmailService } from '@infraestructure/shared/services/NodemailerEmailService';
import { PrismaUserRepository } from '@infraestructure/user/repositories/PrismaUserRepository';

environmentService.load();

const { PORT } = environmentService.get();

api.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const emailService = new NodemailerEmailService();
const userRepository = new PrismaUserRepository();

new SoldBookEmailWorker(emailService, userRepository);
