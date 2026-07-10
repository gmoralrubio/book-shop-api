import { environmentService } from '@infraestructure/EnvironmentService';
import api from './api';

import { SoldBookEmailWorker } from '@infraestructure/shared/SoldBookEmailWorker';

environmentService.load();

const { PORT } = environmentService.get();

api.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const soldBookEmailWorker = new SoldBookEmailWorker();
soldBookEmailWorker.run();
